// Route-level guard rails.
//
// The API grew from seven routes to seventy-four. Two mistakes are easy to
// make and invisible until a feature is used:
//   1. Registering a literal route (GET /admin/list) after a parameter route
//      (GET /:id) so the parameter swallows it.
//   2. Letting the documentation drift away from the code.
//
// Both are checked here.
import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import { readFileSync } from 'node:fs'
import { startTestDatabase, startServer, client, signInAdmin } from './helpers.mjs'

const db = await startTestDatabase()
const { default: app } = await import('../src/app.js')
const { connectDB } = await import('../src/config/db.js')

let server
let api
let admin

before(async () => {
  await connectDB()
  await mongoose.connection.dropDatabase()
  server = await startServer(app)
  api = client(server.base)
  admin = await signInAdmin(api, server.base)
})

after(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  if (server) await server.close()
  await db.stop()
})

// Walks the Express router stack and returns every registered route.
function collectRoutes(stack, prefix, out = []) {
  for (const layer of stack) {
    if (layer.route) {
      for (const method of Object.keys(layer.route.methods)) {
        if (method === '_all') continue
        out.push({ method: method.toUpperCase(), path: `${prefix}${layer.route.path}`.replace(/\/+$/, '') || '/' })
      }
    } else if (layer.name === 'router' && layer.handle?.stack) {
      const match = layer.regexp.source.match(/^\^\\\/(.*?)(?:\\\/)?\?\(\?=\\\/\|\$\)$/)
      const mounted = match ? match[1].replace(/\\\//g, '/').replace(/\\(.)/g, '$1') : ''
      collectRoutes(layer.handle.stack, mounted ? `${prefix}/${mounted}` : prefix, out)
    }
  }
  return out
}

// True when the pattern route would match the literal path. A segment
// starting with ':' matches any value; every other segment must be equal.
function patternMatches(pattern, literal) {
  const a = pattern.split('/')
  const b = literal.split('/')
  if (a.length !== b.length) return false

  let hasParameter = false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].startsWith(':')) {
      hasParameter = true
      continue
    }
    if (a[i] !== b[i]) return false
  }
  return hasParameter
}

test('no route is shadowed by an earlier parameter route', () => {
  const routes = collectRoutes(app._router.stack, '')

  for (let i = 0; i < routes.length; i += 1) {
    const first = routes[i]
    for (let j = i + 1; j < routes.length; j += 1) {
      const second = routes[j]
      // A route can only shadow another route of the same method.
      if (first.method !== second.method) continue
      if (!first.path.includes(':')) continue

      assert.equal(
        patternMatches(first.path, second.path),
        false,
        `${first.method} ${first.path} is registered before ${second.method} ${second.path} and would swallow it`
      )
    }
  }
})

test('every route the frontend calls exists', () => {
  const clientSource = readFileSync(new URL('../../frontend/src/api/client.js', import.meta.url), 'utf8')
  const routes = collectRoutes(app._router.stack, '')

  // The frontend calls client.get('/classes') and
  // client.get(`/homeschooling/slug/${slug}`) against an axios baseURL that
  // already ends in /api.
  const calls = new Set()
  for (const match of clientSource.matchAll(/client\.(get|post|put|patch|delete)\(\s*[`']([^`']+)[`']/g)) {
    calls.add(`${match[1].toUpperCase()} ${match[2]}`)
  }

  assert.ok(calls.size > 0, 'no frontend calls were found in client.js')

  for (const call of calls) {
    const [method, rawPath] = call.split(' ')
    // The dynamic segment is turned into a wildcard so it can be compared
    // with the router's own parameter names.
    const pattern = rawPath
      .split('/')
      .map((segment) => (segment.includes('${') ? ':*' : segment))
      .join('/')

    const found = routes.some((route) => {
      if (route.method !== method) return false
      // The frontend's axios baseURL already ends in /api, so its paths are
      // relative to it.
      const routePath = route.path.startsWith('/api') ? route.path.slice(4) || '/' : route.path
      const routePattern = routePath
        .split('/')
        .map((segment) => (segment.startsWith(':') ? ':*' : segment))
        .join('/')
      return routePattern === pattern
    })
    assert.ok(found, `the frontend calls ${call} but no ${method} route matches it`)
  }
})

test('every endpoint in the API contract exists in the code', () => {
  const contract = readFileSync(new URL('../../docs/api-contract.md', import.meta.url), 'utf8')
  const routes = collectRoutes(app._router.stack, '')
  const known = new Set(routes.map((r) => `${r.method} ${r.path}`))

  // Documented endpoints appear as `| GET | `/api/...` |` table rows.
  const documented = new Set()
  for (const match of contract.matchAll(/\|\s*(GET|POST|PUT|PATCH|DELETE)\s*\|\s*`([^`]+)`\s*\|/g)) {
    documented.add(`${match[1]} ${match[2]}`)
  }

  assert.ok(documented.size > 20, 'the API contract table could not be read')

  const missing = [...documented].filter((entry) => {
    const [method, path] = entry.split(' ')
    if (known.has(entry)) return false
    // The contract may omit the /api prefix in a couple of tables.
    return !known.has(`${method} ${path.startsWith('/api') ? path : `/api${path}`}`)
  })

  assert.deepEqual(missing, [], 'these documented endpoints do not exist in the code')
})

test('the admin service list is reachable and is not treated as a service id', async () => {
  const res = await api.get('/services/admin/list', admin.token)
  assert.equal(res.status, 200)
  assert.ok(Array.isArray(res.body.data))
})

test('the admin service list is still closed to a normal customer', async () => {
  const res = await api.get('/services/admin/list')
  assert.equal(res.status, 401)
})
