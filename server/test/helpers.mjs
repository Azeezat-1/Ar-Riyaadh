// Shared test bootstrap.
//
// Starts an in-memory MongoDB so the suite runs anywhere without a local
// MongoDB installation. If MONGODB_URI_TEST is set, that server is used
// instead (useful in CI with a service container).
import { MongoMemoryServer } from 'mongodb-memory-server'

let memoryServer

export async function startTestDatabase() {
  process.env.NODE_ENV = 'test'

  if (process.env.MONGODB_URI_TEST) {
    process.env.MONGODB_URI = process.env.MONGODB_URI_TEST
    return { uri: process.env.MONGODB_URI, stop: async () => {} }
  }

  memoryServer = await MongoMemoryServer.create()
  process.env.MONGODB_URI = memoryServer.getUri('ar_riyadh_academy_test')
  return {
    uri: process.env.MONGODB_URI,
    stop: async () => {
      if (memoryServer) await memoryServer.stop()
    },
  }
}

// Boots the express app on an ephemeral port and returns the base URL.
export async function startServer(app) {
  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address()
  return {
    base: `http://127.0.0.1:${port}/api`,
    close: () => new Promise((resolve) => server.close(resolve)),
  }
}

// Small fetch wrapper that always sends JSON and always parses JSON.
export function client(base) {
  const call = async (method, path, body, token) => {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(base + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    let parsed = null
    const text = await res.text()
    if (text) {
      try {
        parsed = JSON.parse(text)
      } catch {
        parsed = text
      }
    }
    return { status: res.status, body: parsed, headers: res.headers }
  }

  return {
    get: (path, token) => call('GET', path, undefined, token),
    post: (path, body, token) => call('POST', path, body, token),
    put: (path, body, token) => call('PUT', path, body, token),
    patch: (path, body, token) => call('PATCH', path, body, token),
    delete: (path, token) => call('DELETE', path, undefined, token),
  }
}

// Registers an admin and returns a usable bearer token.
export async function signInAdmin(api, base) {
  const User = (await import('../src/models/User.js')).default
  const { hashPassword } = await import('../src/models/User.js')

  const email = `admin-${Date.now()}@example.com`
  await User.create({
    email,
    name: 'Test Admin',
    roles: ['admin', 'student'],
    passwordHash: await hashPassword('AdminPass123!'),
  })

  const res = await api.post('/auth/login', { email, password: 'AdminPass123!' })
  if (res.status !== 200) {
    throw new Error(`admin sign-in failed: ${res.status} ${JSON.stringify(res.body)}`)
  }
  return { email, password: 'AdminPass123!', token: res.headers.get('x-access-token') }
}

// Registers a normal student and returns a usable bearer token.
export async function signInStudent(api, base) {
  const email = `student-${Date.now()}@example.com`
  const res = await api.post('/auth/register', {
    email,
    password: 'StudentPass123!',
    name: 'Test Student',
  })
  if (res.status !== 201) {
    throw new Error(`student sign-up failed: ${res.status} ${JSON.stringify(res.body)}`)
  }
  return { email, password: 'StudentPass123!', token: res.headers.get('x-access-token') }
}
