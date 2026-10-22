// Tests the seed script. The seed is the reference data the dashboards and
// the frontend content both depend on, so it is checked on every run.
import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import { readFileSync } from 'node:fs'
import { startTestDatabase } from './helpers.mjs'

const { verifyPassword } = await import('../src/models/User.js')

const db = await startTestDatabase()
const { connectDB } = await import('../src/config/db.js')

process.env.SEED_ADMIN_EMAIL = 'seeded-admin@arriyaadh.com'
process.env.SEED_ADMIN_PASSWORD = 'SeedAdminPass123!'

let Class
let Lecture
let Testimonial
let Article
let Subject
let User
let Service
let ServiceSlot
let Setting

before(async () => {
  await connectDB()
  await mongoose.connection.dropDatabase()

  Class = (await import('../src/models/Class.js')).default
  Lecture = (await import('../src/models/Lecture.js')).default
  Testimonial = (await import('../src/models/Testimonial.js')).default
  Article = (await import('../src/models/HomeschoolingArticle.js')).default
  Subject = (await import('../src/models/Subject.js')).default
  User = (await import('../src/models/User.js')).default
  Service = (await import('../src/models/Service.js')).default
  ServiceSlot = (await import('../src/models/ServiceSlot.js')).default
  Setting = (await import('../src/models/Setting.js')).default

  await (await import('../data/seed.js')).default
})

after(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  await db.stop()
})

test('the seed inserts the public content the frontend reads', async () => {
  assert.equal(await Class.countDocuments(), 5)
  assert.equal(await Lecture.countDocuments(), 3)
  assert.equal(await Testimonial.countDocuments(), 3)
  assert.equal(await Article.countDocuments(), 2)
})

test('every seeded class has a slug, a category and a display order', async () => {
  const classes = await Class.find({})
  for (const cls of classes) {
    assert.ok(cls.slug, `${cls.title} has no slug`)
    assert.ok(cls.category, `${cls.title} has no category`)
    assert.ok(Number.isInteger(cls.displayOrder), `${cls.title} has no display order`)
  }
  // Slugs must be unique, which is what the frontend's filters rely on.
  const slugs = classes.map((c) => c.slug)
  assert.equal(new Set(slugs).size, slugs.length)
})

test('the Qurʼān class keeps the exact characters the frontend filters on', async () => {
  // The frontend filters by the category string, so the character sequence
  // matters: U+02BC (modifier letter apostrophe) followed by U+0101 (a with
  // macron).
  const expected = 'Qur\u02bc\u0101n'
  const cls = await Class.findOne({ category: expected })
  assert.ok(cls, 'the Qurʼān class was not seeded')
  assert.equal(cls.title, 'Qur\u02bc\u0101n Recitation & Tajweed')
  assert.deepEqual(
    [...cls.category].map((c) => c.codePointAt(0)),
    [0x51, 0x75, 0x72, 0x02bc, 0x0101, 0x6e]
  )
})

test('the frontend and the backend use the same Qurʼān characters', () => {
  // The frontend writes the apostrophe as a \u escape. Decoding its escapes
  // must produce exactly the same characters the backend stores, otherwise
  // the category filter on the public site silently returns nothing.
  const frontend = readFileSync(
    new URL('../../frontend/src/data/content.js', import.meta.url),
    'utf8'
  )
  const decoded = frontend.replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  assert.ok(
    decoded.includes('Qur\u02bc\u0101n'),
    'the frontend and backend must use identical characters for the Qurʼān category'
  )
})

test('the seed creates the admin account with a usable password', async () => {
  const admin = await User.findOne({ email: 'seeded-admin@arriyaadh.com' }).select('+passwordHash')
  assert.ok(admin)
  assert.ok(admin.roles.includes('admin'))
  assert.ok(admin.passwordHash)
  // The stored value must be a hash, and the seeded password must verify
  // against it, otherwise the admin cannot sign in.
  assert.notEqual(admin.passwordHash, 'SeedAdminPass123!')
  assert.ok(verifyPassword('SeedAdminPass123!', admin.passwordHash))
  assert.ok(!(await verifyPassword('wrong-password', admin.passwordHash)))
})

test('the seed creates the reference data the dashboards read', async () => {
  assert.equal(await Subject.countDocuments(), 6)
  assert.equal(await Service.countDocuments(), 2)
  assert.equal(await Setting.countDocuments(), 5)
})

test('the booked slot calendar is generated for the next two weeks', async () => {
  const slots = await ServiceSlot.find({})
  assert.ok(slots.length > 0)
  for (const slot of slots) {
    assert.equal(slot.bookedCount, 0)
    assert.ok(slot.endsAt > slot.startsAt)
    const day = slot.startsAt.getDay()
    assert.ok(day !== 0 && day !== 6, 'slots must only fall on working days')
  }
})

test('re-running the seed does not duplicate reference data', async () => {
  await (await import('../data/seed.js')).default
  assert.equal(await Subject.countDocuments(), 6)
  assert.equal(await Service.countDocuments(), 2)
  assert.equal(await Setting.countDocuments(), 5)
  assert.equal(await User.countDocuments(), 1)
  assert.equal(await Class.countDocuments(), 5)
})
