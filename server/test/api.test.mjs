// Public API test suite. These cover the endpoints the existing React
// frontend depends on, so a change to the backend can never silently break
// the public site.
//
// Run with: npm test
import test, { before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import { startTestDatabase, startServer, client, signInAdmin } from './helpers.mjs'

const db = await startTestDatabase()
const { default: app } = await import('../src/app.js')
const { connectDB } = await import('../src/config/db.js')
const Class = (await import('../src/models/Class.js')).default
const Testimonial = (await import('../src/models/Testimonial.js')).default

let server
let api
let admin

before(async () => {
  await connectDB()
  await mongoose.connection.dropDatabase()
  server = await startServer(app)
  api = client(server.base)
})

after(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  if (server) await server.close()
  await db.stop()
})

beforeEach(async () => {
  await Class.deleteMany({})
  await Testimonial.deleteMany({})
  if (!admin) admin = await signInAdmin(api, server.base)
})

test('GET /health reports ok', async () => {
  const res = await api.get('/health')
  assert.equal(res.status, 200)
  assert.deepEqual(res.body, { status: 'ok' })
})

test('unknown route returns a JSON 404', async () => {
  const res = await api.get('/does-not-exist')
  assert.equal(res.status, 404)
  assert.match(res.body.message, /Route not found/)
})

test('classes: create, list, filter, update, delete', async () => {
  const created = await api.post(
    '/classes',
    {
      title: 'E2E Tafsir',
      category: 'Tafsir',
      description: 'A temporary class used only for automated tests.',
    },
    admin.token
  )
  assert.equal(created.status, 201)
  const cls = created.body.data
  assert.ok(cls._id)

  const list = await api.get('/classes')
  assert.equal(list.body.count, 1)

  const filtered = await api.get('/classes?category=Tafsir')
  assert.equal(filtered.body.count, 1)
  const noMatch = await api.get('/classes?category=Hadith')
  assert.equal(noMatch.body.count, 0)

  const updated = await api.put(`/classes/${cls._id}`, { title: 'E2E Tafsir Updated' }, admin.token)
  assert.equal(updated.body.data.title, 'E2E Tafsir Updated')

  const del = await api.delete(`/classes/${cls._id}`, admin.token)
  assert.equal(del.status, 204)
  assert.equal((await api.get(`/classes/${cls._id}`)).body.data, undefined)
})

test('classes: the frontend envelope is { count, data }', async () => {
  // frontend/src/api/client.js reads res.data.data for every list endpoint.
  await api.post(
    '/classes',
    { title: 'Envelope Class', category: 'Hadith', description: 'Checks the response envelope shape.' },
    admin.token
  )
  const res = await api.get('/classes')
  assert.ok(Array.isArray(res.body.data), 'data must be an array')
  assert.equal(typeof res.body.count, 'number')
})

test('classes: bad payload rejected with field details', async () => {
  const res = await api.post('/classes', { title: '', category: 'Nope', description: 'x' }, admin.token)
  assert.equal(res.status, 400)
  assert.equal(res.body.message, 'Validation failed')
  assert.deepEqual(
    res.body.details.map((d) => d.field).sort(),
    ['category', 'description', 'title']
  )
})

test('classes: invalid id returns 400', async () => {
  const res = await api.get('/classes/not-an-id')
  assert.equal(res.status, 400)
  assert.equal(res.body.message, 'Invalid identifier format')
})

test('classes: writes require an admin account', async () => {
  const res = await api.post('/classes', {
    title: 'Unauthorised Class',
    category: 'Tafsir',
    description: 'Should be rejected without an admin token.',
  })
  assert.equal(res.status, 401)
})

test('testimonials: submissions start pending and are hidden publicly', async () => {
  const submitted = await api.post('/testimonials', {
    name: 'Student',
    content: 'A brand new student testimonial awaiting approval.',
  })
  assert.equal(submitted.status, 201)
  assert.equal(submitted.body.data.approved, false)

  const publicList = await api.get('/testimonials')
  assert.equal(publicList.body.count, 0)

  await Testimonial.updateOne({}, { approved: true })
  const afterApproval = await api.get('/testimonials')
  assert.equal(afterApproval.body.count, 1)
  assert.equal(afterApproval.body.data[0].approved, true)
})

test('articles: created with unique slug, queried by slug, duplicate rejected', async () => {
  const created = await api.post(
    '/homeschooling',
    {
      title: 'Test Article',
      slug: 'test-article',
      content: 'Full body of the test article.',
    },
    admin.token
  )
  assert.equal(created.status, 201)

  const bySlug = await api.get('/homeschooling/slug/test-article')
  assert.equal(bySlug.status, 200)
  assert.equal(bySlug.body.data.title, 'Test Article')

  const dup = await api.post('/homeschooling', { title: 'Duplicate', slug: 'test-article' }, admin.token)
  assert.equal(dup.status, 409)
  assert.match(dup.body.message, /already exists/)

  const list = await api.get('/homeschooling')
  assert.equal(list.body.count, 1)
  assert.ok(!('content' in list.body.data[0]), 'list omits full content for performance')
})

test('contact: valid submission stored, invalid submission rejected', async () => {
  const ok = await api.post('/contact', {
    name: 'Amina',
    email: 'amina@example.com',
    message: 'Please tell me more about the Arabic classes.',
  })
  assert.equal(ok.status, 201)
  assert.match(ok.body.message, /get back to you/)

  const bad = await api.post('/contact', { name: '', email: 'nope', message: 'short' })
  assert.equal(bad.status, 400)
  assert.deepEqual(
    bad.body.details.map((d) => d.field).sort(),
    ['email', 'message', 'name']
  )
})

test('lectures: default status is Upcoming', async () => {
  const res = await api.post('/lectures', { title: 'Friday Lecture' }, admin.token)
  assert.equal(res.status, 201)
  assert.equal(res.body.data.status, 'Upcoming')
})
