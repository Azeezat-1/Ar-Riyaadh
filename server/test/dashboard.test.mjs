// Tests for the account, enrolment, booking, consultation and admin areas.
import test, { before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import { startTestDatabase, startServer, client, signInAdmin, signInStudent } from './helpers.mjs'

const db = await startTestDatabase()
const { default: app } = await import('../src/app.js')
const { connectDB } = await import('../src/config/db.js')

const Class = (await import('../src/models/Class.js')).default
const Enrollment = (await import('../src/models/Enrollment.js')).default
const Lesson = (await import('../src/models/Lesson.js')).default
const Service = (await import('../src/models/Service.js')).default
const ServiceSlot = (await import('../src/models/ServiceSlot.js')).default
const Booking = (await import('../src/models/Booking.js')).default
const Consultation = (await import('../src/models/Consultation.js')).default
const Order = (await import('../src/models/Order.js')).default
const User = (await import('../src/models/User.js')).default

let server
let api
let admin
let student

before(async () => {
  await connectDB()
  await mongoose.connection.dropDatabase()
  server = await startServer(app)
  api = client(server.base)
  admin = await signInAdmin(api, server.base)
  student = await signInStudent(api, server.base)
})

after(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  if (server) await server.close()
  await db.stop()
})

beforeEach(async () => {
  await Promise.all([
    Class.deleteMany({}),
    Enrollment.deleteMany({}),
    Lesson.deleteMany({}),
    Service.deleteMany({}),
    ServiceSlot.deleteMany({}),
    Booking.deleteMany({}),
    Consultation.deleteMany({}),
    Order.deleteMany({}),
  ])
})

// --------------------------------------------------------------- accounts ---

test('registration creates a student and returns a session token', async () => {
  const res = await api.post('/auth/register', {
    email: 'new@example.com',
    password: 'Passw0rd!23',
    name: 'New Student',
  })
  assert.equal(res.status, 201)
  assert.equal(res.body.data.email, 'new@example.com')
  assert.deepEqual(res.body.data.roles, ['student'])
  assert.ok(res.headers.get('x-access-token'))
  assert.ok(res.headers.get('x-refresh-token'))
  // The contract promises the tokens in the body as well as the headers.
  assert.ok(res.body.data.accessToken, 'register should return accessToken in the body')
  assert.ok(res.body.data.refreshToken, 'register should return refreshToken in the body')
  // The password hash must never appear in a response.
  assert.equal(res.body.data.passwordHash, undefined)
})

test('registration cannot grant itself the admin role', async () => {
  const res = await api.post('/auth/register', {
    email: 'sneaky@example.com',
    password: 'Passw0rd!23',
    name: 'Sneaky',
    roles: ['admin'],
  })
  assert.equal(res.status, 201)
  assert.deepEqual(res.body.data.roles, ['student'], 'admin must not be self-assignable')
})

test('registration rejects a weak password with field details', async () => {
  const res = await api.post('/auth/register', {
    email: 'weak@example.com',
    password: '123',
    name: 'Weak',
  })
  assert.equal(res.status, 400)
  assert.equal(res.body.message, 'Validation failed')
  assert.ok(res.body.details.some((d) => d.field === 'password'))
})

test('registration rejects a duplicate email', async () => {
  await api.post('/auth/register', { email: 'dupe@example.com', password: 'Passw0rd!23', name: 'First User' })
  const res = await api.post('/auth/register', { email: 'dupe@example.com', password: 'Passw0rd!23', name: 'Second User' })
  assert.equal(res.status, 409)
  assert.match(res.body.message, /already exists/)
})

test('login succeeds with the right password and fails with the wrong one', async () => {
  const email = `login-${Date.now()}@example.com`
  await api.post('/auth/register', { email, password: 'Passw0rd!23', name: 'Login User' })

  const good = await api.post('/auth/login', { email, password: 'Passw0rd!23' })
  assert.equal(good.status, 200)
  assert.ok(good.headers.get('x-access-token'))
  // The contract promises the tokens in the body as well as the headers.
  assert.ok(good.body.data.accessToken, 'login should return accessToken in the body')
  assert.ok(good.body.data.refreshToken, 'login should return refreshToken in the body')
  // The token in the body must be the one that works.
  const me = await api.get('/auth/me', good.body.data.accessToken)
  assert.equal(me.status, 200)
  assert.equal(me.body.data.email, email)

  const bad = await api.post('/auth/login', { email, password: 'wrong-password' })
  assert.equal(bad.status, 401)
  assert.match(bad.body.message, /Invalid email or password/)
})

test('a protected route rejects a request with no token', async () => {
  const res = await api.get('/me')
  assert.equal(res.status, 401)
})

test('a protected route rejects a made-up token', async () => {
  const res = await api.get('/me', 'not-a-real-token')
  assert.equal(res.status, 401)
})

test('GET /auth/me returns the signed-in user without the password hash', async () => {
  const res = await api.get('/auth/me', student.token)
  assert.equal(res.status, 200)
  assert.equal(res.body.data.email, student.email)
  assert.equal(res.body.data.passwordHash, undefined)
})

test('GET /me returns the account overview for the signed-in user', async () => {
  const res = await api.get('/me', student.token)
  assert.equal(res.status, 200)
  assert.equal(res.body.data.user.email, student.email)
  assert.equal(res.body.data.stats.enrollments, 0)
  assert.equal(res.body.data.stats.bookings, 0)
  assert.equal(res.body.data.user.passwordHash, undefined)
})

test('refresh rotates the token and the old one stops working', async () => {
  const email = `refresh-${Date.now()}@example.com`
  const reg = await api.post('/auth/register', { email, password: 'Passw0rd!23', name: 'Refresh' })
  const refreshToken = reg.headers.get('x-refresh-token')

  const first = await api.post('/auth/refresh', { refreshToken })
  assert.equal(first.status, 200)
  const newRefresh = first.body.data.refreshToken
  assert.notEqual(newRefresh, refreshToken, 'refresh must rotate the token')

  // Replaying the old token is treated as theft: the whole family is revoked.
  const replay = await api.post('/auth/refresh', { refreshToken })
  assert.equal(replay.status, 401)

  // ...and the newly issued token is revoked with it.
  const after = await api.post('/auth/refresh', { refreshToken: newRefresh })
  assert.equal(after.status, 401)
})

test('changing the password ends every other session', async () => {
  const email = `pw-${Date.now()}@example.com`
  const reg = await api.post('/auth/register', { email, password: 'Passw0rd!23', name: 'PW' })
  const token = reg.headers.get('x-access-token')

  const res = await api.post('/auth/change-password', { currentPassword: 'Passw0rd!23', newPassword: 'NewPassw0rd!' }, token)
  assert.equal(res.status, 200)

  const after = await api.get('/me', token)
  assert.equal(after.status, 401, 'the old session must be revoked')
})

// ------------------------------------------------------------ enrolments ---

test('a student can enrol in a free class and progress is tracked', async () => {
  const cls = await Class.create({
    title: 'Free Class',
    category: 'Hadith',
    description: 'Free class for the enrolment test.',
    accessType: 'free',
  })
  const lesson = await Lesson.create({ classId: cls._id, title: 'Lesson One', order: 1 })

  const enrolled = await api.post('/enrollments', { classId: cls._id }, student.token)
  assert.equal(enrolled.status, 201)
  assert.equal(enrolled.body.data.status, 'active')

  const progress = await api.patch(`/enrollments/${enrolled.body.data._id}/progress`, { lessonId: lesson._id }, student.token)
  assert.equal(progress.status, 200)
  assert.equal(progress.body.data.progressPercent, 100)
  assert.equal(progress.body.data.lessonsCompleted, 1)
})

test('a paid class cannot be joined without paying', async () => {
  const cls = await Class.create({
    title: 'Paid Class',
    category: 'Arabic Language',
    description: 'Paid class for the enrolment test.',
    accessType: 'paid',
    priceKobo: 1500000,
  })
  const res = await api.post('/enrollments', { classId: cls._id }, student.token)
  assert.equal(res.status, 402)
})

test('a student cannot enrol twice in the same class', async () => {
  const cls = await Class.create({ title: 'Once', category: 'Tafsir', description: 'Enrol only once.' })
  await api.post('/enrollments', { classId: cls._id }, student.token)
  const res = await api.post('/enrollments', { classId: cls._id }, student.token)
  assert.equal(res.status, 409)
})

test('a student cannot read another student\'s enrollment', async () => {
  const other = await signInStudent(api, server.base)
  const cls = await Class.create({ title: 'Private', category: 'Tafsir', description: 'Private enrolment.' })
  const enrolled = await api.post('/enrollments', { classId: cls._id }, student.token)

  const res = await api.get(`/enrollments/${enrolled.body.data._id}`, other.token)
  assert.equal(res.status, 403)
})

test('an admin can transfer a student between classes', async () => {
  const from = await Class.create({ title: 'From', category: 'Tafsir', description: 'Transfer source class.' })
  const to = await Class.create({ title: 'To', category: 'Hadith', description: 'Transfer target class.' })

  const enrolled = await api.post('/enrollments', { classId: from._id }, student.token)
  const res = await api.post(`/admin/enrollments/${enrolled.body.data._id}/transfer`, { toClassId: to._id, reason: 'Moved' }, admin.token)
  assert.equal(res.status, 200)
  assert.equal(res.body.data.classId, to._id.toString())

  const old = await Enrollment.findById(enrolled.body.data._id)
  assert.equal(old.status, 'cancelled')
})

test('a student cannot transfer themselves', async () => {
  const from = await Class.create({ title: 'F2', category: 'Tafsir', description: 'Transfer guard source.' })
  const to = await Class.create({ title: 'T2', category: 'Hadith', description: 'Transfer guard target.' })
  const enrolled = await api.post('/enrollments', { classId: from._id }, student.token)

  const res = await api.post(`/admin/enrollments/${enrolled.body.data._id}/transfer`, { toClassId: to._id }, student.token)
  assert.equal(res.status, 403)
})

// --------------------------------------------------------------- bookings ---

test('a booking reserves the slot and a second booking is rejected', async () => {
  const service = await Service.create({
    title: 'Hijaamah',
    slug: 'hijaamah-test',
    durationMinutes: 60,
    priceKobo: 1500000,
    capacityPerSlot: 1,
    requiresHealthForm: true,
  })
  const slot = await ServiceSlot.create({
    serviceId: service._id,
    startsAt: new Date(Date.now() + 86400000),
    endsAt: new Date(Date.now() + 90000000),
    capacity: 1,
  })

  const healthForm = { consentGiven: true, conditions: ['None'], bloodPressure: '120/80' }

  const first = await api.post('/bookings', { serviceId: service._id, slotId: slot._id, healthForm }, student.token)
  assert.equal(first.status, 201)
  assert.equal(first.body.data.status, 'pending')

  const second = await api.post('/bookings', { serviceId: service._id, slotId: slot._id, healthForm }, student.token)
  assert.equal(second.status, 409, 'the slot must not be oversold')

  const updated = await ServiceSlot.findById(slot._id)
  assert.equal(updated.bookedCount, 1)
})

test('a service that requires a health form rejects a booking without consent', async () => {
  const service = await Service.create({
    title: 'Hijaamah Consent',
    slug: 'hijaamah-consent',
    durationMinutes: 60,
    priceKobo: 1500000,
    requiresHealthForm: true,
  })
  const slot = await ServiceSlot.create({
    serviceId: service._id,
    startsAt: new Date(Date.now() + 86400000),
    endsAt: new Date(Date.now() + 90000000),
    capacity: 5,
  })

  const res = await api.post('/bookings', { serviceId: service._id, slotId: slot._id }, student.token)
  assert.equal(res.status, 400)
  assert.match(res.body.message, /consent/i)
})

test('cancelling a booking returns the place to the slot', async () => {
  const service = await Service.create({ title: 'Cancelable', slug: 'cancelable', durationMinutes: 30, priceKobo: 0 })
  const slot = await ServiceSlot.create({
    serviceId: service._id,
    startsAt: new Date(Date.now() + 86400000),
    endsAt: new Date(Date.now() + 90000000),
    capacity: 2,
  })

  const created = await api.post('/bookings', { serviceId: service._id, slotId: slot._id }, student.token)
  const cancelled = await api.post(`/bookings/${created.body.data._id}/cancel`, {}, student.token)
  assert.equal(cancelled.status, 200)
  assert.equal(cancelled.body.data.status, 'cancelled')

  const updated = await ServiceSlot.findById(slot._id)
  assert.equal(updated.bookedCount, 0)
})

test('an admin can review the health form and clear it', async () => {
  const service = await Service.create({ title: 'Review', slug: 'review', durationMinutes: 60, priceKobo: 0, requiresHealthForm: true })
  const slot = await ServiceSlot.create({
    serviceId: service._id,
    startsAt: new Date(Date.now() + 86400000),
    endsAt: new Date(Date.now() + 90000000),
    capacity: 1,
  })
  const created = await api.post(
    '/bookings',
    { serviceId: service._id, slotId: slot._id, healthForm: { consentGiven: true } },
    student.token
  )

  const res = await api.post(`/bookings/admin/${created.body.data._id}/health-review`, { cleared: true, notes: 'Suitable' }, admin.token)
  assert.equal(res.status, 200)
  assert.equal(res.body.data.healthForm.cleared, true)
})

// ---------------------------------------------------------- consultations ---

test('a consultation can be raised by a guest without an account', async () => {
  const res = await api.post('/consultations', {
    subject: 'Question about Arabic class',
    message: 'I would like to know the schedule for the next intake.',
    guestEmail: 'guest@example.com',
    guestName: 'Guest',
  })
  assert.equal(res.status, 201)
  assert.equal(res.body.data.guestEmail, 'guest@example.com')
  assert.ok(res.body.data.responseDueAt, 'an SLA deadline is set from the priority')
})

test('a signed-in customer can reply in their consultation thread', async () => {
  const created = await api.post('/consultations', { subject: 'Follow up', message: 'Following up on my earlier question.' }, student.token)
  const res = await api.post(`/consultations/${created.body.data._id}/messages`, { body: 'Any update?' }, student.token)
  assert.equal(res.status, 201)
  assert.equal(res.body.data.author, 'customer')
})

test('an admin reply stamps the first response time', async () => {
  const created = await api.post('/consultations', { subject: 'Admin reply test', message: 'Please get back to me.' }, student.token)
  await api.post(`/consultations/${created.body.data._id}/messages`, { body: 'Assalamu alaykum, here is the answer.' }, admin.token)

  const res = await api.get(`/consultations/${created.body.data._id}`, admin.token)
  assert.equal(res.status, 200)
  assert.ok(res.body.data.firstResponseAt, 'firstResponseAt must be stamped')
})

test('a customer cannot read another customer\'s consultation', async () => {
  const other = await signInStudent(api, server.base)
  const created = await api.post('/consultations', { subject: 'Private thread', message: 'This is a private message.' }, student.token)
  const res = await api.get(`/consultations/${created.body.data._id}`, other.token)
  assert.equal(res.status, 403)
})

// ----------------------------------------------------------------- admin ----

test('the admin dashboard returns the aggregate counters', async () => {
  const res = await api.get('/admin/dashboard', admin.token)
  assert.equal(res.status, 200)
  assert.ok('users' in res.body.data)
  assert.ok('revenue' in res.body.data)
  assert.equal(res.body.data.revenue.currency, 'NGN')
})

test('a normal student cannot reach the admin area', async () => {
  const res = await api.get('/admin/dashboard', student.token)
  assert.equal(res.status, 403)
})

test('an admin can list users and change a role', async () => {
  const list = await api.get('/admin/users', admin.token)
  assert.equal(list.status, 200)
  assert.ok(list.body.total >= 1)

  const target = await User.findOne({ email: student.email })
  const res = await api.patch(`/admin/users/${target._id}`, { roles: ['student', 'customer'] }, admin.token)
  assert.equal(res.status, 200)
  assert.deepEqual(res.body.data.roles.sort(), ['customer', 'student'])
})

test('an admin cannot grant an unknown role', async () => {
  const target = await User.findOne({ email: student.email })
  const res = await api.patch(`/admin/users/${target._id}`, { roles: ['superuser'] }, admin.token)
  assert.equal(res.status, 400)
})

// --------------------------------------------------------------- payments ---

test('creating an order stores kobo amounts exactly', async () => {
  const cls = await Class.create({
    title: 'Paid Arabic',
    category: 'Arabic Language',
    description: 'A paid class for the order test.',
    accessType: 'paid',
    priceKobo: 1500000,
  })

  const res = await api.post('/payments/orders', { orderType: 'course_enrollment', classId: cls._id }, student.token)
  assert.equal(res.status, 201)
  assert.equal(res.body.data.amountKobo, 1500000)
  assert.equal(res.body.data.totalKobo, 1500000)
  assert.equal(res.body.data.currency, 'NGN')
  assert.equal(res.body.data.status, 'pending')
})

test('a coupon reduces the order total', async () => {
  const { default: Coupon } = await import('../src/models/Coupon.js')
  await Coupon.create({ code: 'WELCOME10', percentOff: 10 })

  const cls = await Class.create({
    title: 'Discounted Class',
    category: 'Arabic Language',
    description: 'A class used to test the coupon path.',
    accessType: 'paid',
    priceKobo: 1000000,
  })

  const res = await api.post(
    '/payments/orders',
    { orderType: 'course_enrollment', classId: cls._id, couponCode: 'WELCOME10' },
    student.token
  )
  assert.equal(res.status, 201)
  assert.equal(res.body.data.discountKobo, 100000)
  assert.equal(res.body.data.totalKobo, 900000)
})

test('an invalid coupon is rejected', async () => {
  const cls = await Class.create({
    title: 'No Discount Class',
    category: 'Arabic Language',
    description: 'A class used to test a bad coupon.',
    accessType: 'paid',
    priceKobo: 1000000,
  })
  const res = await api.post(
    '/payments/orders',
    { orderType: 'course_enrollment', classId: cls._id, couponCode: 'NOPE' },
    student.token
  )
  assert.equal(res.status, 400)
})

test('a webhook with a bad signature is rejected', async () => {
  const res = await api.post('/payments/webhook', { event: 'charge.success', data: { id: 1 } })
  assert.equal(res.status, 401)
})
