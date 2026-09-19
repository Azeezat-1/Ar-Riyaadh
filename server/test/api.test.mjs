// API test suite — run with: npm test
// Uses node:test (built into Node 20+) against a dedicated test database,
// so the seeded/dev data is never touched.
import test, { before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'

process.env.NODE_ENV = 'test'
process.env.MONGODB_URI =
  process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/ar_riyadh_academy_test'

const { default: app } = await import('../src/app.js')
const { connectDB } = await import('../src/config/db.js')
const Class = (await import('../src/models/Class.js')).default
const Testimonial = (await import('../src/models/Testimonial.js')).default

let base

before(async () => {
  await connectDB()
  await mongoose.connection.dropDatabase()
  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  base = `http://127.0.0.1:${server.address().port}/api`
})

after(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
})

beforeEach(async () => {
  await Class.deleteMany({})
  await Testimonial.deleteMany({})
})

const post = (path, body) =>
  fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

test('GET /health reports ok', async () => {
  const res = await fetch(base + '/health')
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { status: 'ok' })
})

test('unknown route returns a JSON 404', async () => {
  const res = await fetch(base + '/does-not-exist')
  assert.equal(res.status, 404)
  const body = await res.json()
  assert.match(body.message, /Route not found/)
})

test('classes: create, list, filter, update, delete', async () => {
  const created = await post('/classes', {
    title: 'E2E Tafsir',
    category: 'Tafsir',
    description: 'A temporary class used only for automated tests.',
  })
  assert.equal(created.status, 201)
  const cls = (await created.json()).data
  assert.ok(cls._id)

  const list = await fetch(base + '/classes')
  assert.equal((await list.json()).count, 1)

  const filtered = await fetch(base + '/classes?category=Tafsir')
  assert.equal((await filtered.json()).count, 1)
  const noMatch = await fetch(base + '/classes?category=Hadith')
  assert.equal((await noMatch.json()).count, 0)

  const updated = await fetch(base + `/classes/${cls._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'E2E Tafsir Updated' }),
  })
  assert.equal((await updated.json()).data.title, 'E2E Tafsir Updated')

  const del = await fetch(base + `/classes/${cls._id}`, { method: 'DELETE' })
  assert.equal(del.status, 204)
  assert.equal((await (await fetch(base + `/classes/${cls._id}`)).json()).data, undefined)
})

test('classes: bad payload rejected with field details', async () => {
  const res = await post('/classes', { title: '', category: 'Nope', description: 'x' })
  assert.equal(res.status, 400)
  const body = await res.json()
  assert.equal(body.message, 'Validation failed')
  assert.deepEqual(
    body.details.map((d) => d.field).sort(),
    ['category', 'description', 'title']
  )
})

test('classes: invalid id returns 400', async () => {
  const res = await fetch(base + '/classes/not-an-id')
  assert.equal(res.status, 400)
  assert.equal((await res.json()).message, 'Invalid identifier format')
})

test('testimonials: submissions start pending and are hidden publicly', async () => {
  const submitted = await post('/testimonials', {
    name: 'Student',
    content: 'A brand new student testimonial awaiting approval.',
  })
  assert.equal(submitted.status, 201)
  assert.equal((await submitted.json()).data.approved, false)

  const publicList = await (await fetch(base + '/testimonials')).json()
  assert.equal(publicList.count, 0)

  await Testimonial.updateOne({}, { approved: true })
  const afterApproval = await (await fetch(base + '/testimonials')).json()
  assert.equal(afterApproval.count, 1)
  assert.equal(afterApproval.data[0].approved, true)
})

test('articles: created with unique slug, queried by slug, duplicate rejected', async () => {
  const created = await post('/homeschooling', {
    title: 'Test Article',
    slug: 'test-article',
    content: 'Full body of the test article.',
  })
  assert.equal(created.status, 201)

  const bySlug = await fetch(base + '/homeschooling/slug/test-article')
  assert.equal(bySlug.status, 200)
  assert.equal((await bySlug.json()).data.title, 'Test Article')

  const dup = await post('/homeschooling', { title: 'Duplicate', slug: 'test-article' })
  assert.equal(dup.status, 409)
  assert.match((await dup.json()).message, /already exists/)

  const list = await fetch(base + '/homeschooling')
  const listBody = await list.json()
  assert.equal(listBody.count, 1)
  assert.ok(!('content' in listBody.data[0]), 'list omits full content for performance')
})

test('contact: valid submission stored, invalid submission rejected', async () => {
  const ok = await post('/contact', {
    name: 'Amina',
    email: 'amina@example.com',
    message: 'Please tell me more about the Arabic classes.',
  })
  assert.equal(ok.status, 201)
  assert.match((await ok.json()).message, /get back to you/)

  const bad = await post('/contact', { name: '', email: 'nope', message: 'short' })
  assert.equal(bad.status, 400)
  assert.deepEqual(
    (await bad.json()).details.map((d) => d.field).sort(),
    ['email', 'message', 'name']
  )
})

test('lectures: default status is Upcoming', async () => {
  const res = await post('/lectures', { title: 'Friday Lecture' })
  assert.equal(res.status, 201)
  assert.equal((await res.json()).data.status, 'Upcoming')
})