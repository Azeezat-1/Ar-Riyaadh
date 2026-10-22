/**
 * Full local stack smoke test.
 *
 * Starts MongoDB, seeds the database, boots the API, starts the Vite dev
 * server and checks that the frontend's own proxy can reach the API through
 * the real HTTP stack. Everything is torn down when the checks finish.
 *
 * Usage:
 *   node scripts/smoke.mjs
 */

import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
// The API must listen on 4000 because the frontend's Vite proxy targets
// http://localhost:4000 (see frontend/vite.config.js).
const API_PORT = 4000
const DB_NAME = 'ar-riyadh-smoke'

/** Picks a free port so the smoke test never collides with a running dev server. */
async function freePort() {
  const { createServer } = await import('node:net')
  return new Promise((resolve, reject) => {
    const srv = createServer()
    srv.on('error', reject)
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address()
      srv.close(() => resolve(port))
    })
  })
}

const failures = []
function check(name, ok, detail = '') {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
  if (!ok) failures.push(name)
}

function findMongod() {
  const dirs = [
    join(homedir(), '.cache', 'mongodb-binaries'),
    join(homedir(), 'Library', 'Caches', 'mongodb-binaries'),
  ]
  for (const dir of dirs) {
    if (!existsSync(dir)) continue
    const binary = readdirSync(dir).find((f) => f.startsWith('mongod'))
    if (binary) return join(dir, binary)
  }
  return null
}

async function waitFor(url, tries = 60, delay = 500) {
  for (let i = 0; i < tries; i += 1) {
    try {
      const res = await fetch(url)
      if (res.status < 500) return res
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, delay))
  }
  throw new Error(`timed out waiting for ${url}`)
}

// ---------------------------------------------------------------- 1. mongod
const mongod = findMongod()
if (!mongod) {
  console.error('No mongod binary. Run `npm test` once to download one.')
  process.exit(1)
}
const dbPath = join(homedir(), '.ar-riyadh-smoke')
rmSync(dbPath, { recursive: true, force: true })
mkdirSync(dbPath, { recursive: true })

const mongo = spawn(
  mongod,
  ['--dbpath', dbPath, '--port', '27019', '--bind_ip', '127.0.0.1'],
  { stdio: ['ignore', 'ignore', 'inherit'] }
)
const URI = `mongodb://127.0.0.1:27019/${DB_NAME}`
process.env.MONGODB_URI = URI
process.env.NODE_ENV = 'development'
process.env.PORT = String(API_PORT)
process.env.CORS_ORIGINS = '*'

const busy = spawnSync('lsof', ['-ti', `tcp:${API_PORT}`], { encoding: 'utf8' })
if (busy.stdout.trim()) {
  console.error(`port ${API_PORT} is already in use; stop that server and try again.`)
  process.exit(1)
}

console.log('Waiting for MongoDB...')
// mongod does not speak HTTP, so poll it with the driver instead.
const { MongoClient } = await import('mongodb')
let mongoReady = false
for (let i = 0; i < 40 && !mongoReady; i += 1) {
  try {
    const client = await MongoClient.connect(URI, { serverSelectionTimeoutMS: 1000 })
    await client.close()
    mongoReady = true
  } catch {
    await new Promise((r) => setTimeout(r, 500))
  }
}
if (!mongoReady) {
  console.error('MongoDB did not come up')
  process.exit(1)
}

// ------------------------------------------------------------------ 2. seed
console.log('Seeding...')
const seed = spawnSync('node', ['data/seed.js'], {
  cwd: join(ROOT, 'server'),
  env: process.env,
  encoding: 'utf8',
})
if (seed.status !== 0) {
  console.error(seed.stdout, seed.stderr)
  process.exit(1)
}

// ------------------------------------------------------------------- 3. api
const { default: app } = await import('../server/src/app.js')
const { connectDB } = await import('../server/src/config/db.js')
await connectDB()
const server = app.listen(API_PORT)
await waitFor(`http://127.0.0.1:${API_PORT}/api/health`)
console.log('API up.\n')

// ---------------------------------------------------------------- 4. vite
const WEB_PORT = await freePort()
const viteBin = join(ROOT, 'frontend', 'node_modules', '.bin', 'vite')
const vite = spawn(viteBin, ['--port', String(WEB_PORT), '--strictPort'], {
  cwd: join(ROOT, 'frontend'),
  stdio: ['ignore', 'pipe', 'pipe'],
})
let viteLog = ''
vite.stdout.on('data', (d) => { viteLog += d })
vite.stderr.on('data', (d) => { viteLog += d })
const webUp = await waitFor(`http://localhost:${WEB_PORT}/`, 60).catch(() => null)
if (!webUp) {
  console.error(`the frontend dev server did not start:\n${viteLog}`)
  vite.kill('SIGTERM')
  server.close()
  mongo.kill('SIGTERM')
  process.exit(1)
}

// ---------------------------------------------------------------- 5. checks
console.log('\nAPI direct')
const apiBase = `http://127.0.0.1:${API_PORT}/api`
const classes = await (await fetch(`${apiBase}/classes`)).json()
check('GET /api/classes returns { count, data }', 'count' in classes && Array.isArray(classes.data), `count = ${classes.count}`)
check('the seeded classes are present', classes.count === 5, `${classes.count} classes`)
check('the Qurʼān class keeps its exact characters', classes.data[0]?.title === 'Qurʼān Recitation & Tajweed', classes.data[0]?.title)

const testimonials = await (await fetch(`${apiBase}/testimonials`)).json()
check('GET /api/testimonials returns the approved ones', testimonials.count === 3, `count = ${testimonials.count}`)

const articles = await (await fetch(`${apiBase}/homeschooling`)).json()
check('GET /api/homeschooling returns the articles', articles.count === 2, `count = ${articles.count}`)

const slug = articles.data[0].slug
const article = await (await fetch(`${apiBase}/homeschooling/slug/${slug}`)).json()
check('GET /api/homeschooling/slug/:slug resolves', article.data?.slug === slug, article.data?.title)

const lectures = await (await fetch(`${apiBase}/lectures`)).json()
check('GET /api/lectures returns the seeded lectures', lectures.count === 3, `count = ${lectures.count}`)

const unauth = await fetch(`${apiBase}/admin/dashboard`)
check('GET /api/admin/dashboard is closed to anonymous callers', unauth.status === 401, `HTTP ${unauth.status}`)

const login = await fetch(`${apiBase}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@arriyaadh.com', password: 'ChangeMe123!' }),
})
const loginBody = await login.json()
check(
  'the seeded admin can sign in',
  login.status === 200 && !!loginBody.data?.accessToken,
  `HTTP ${login.status}, accessToken in body = ${!!loginBody.data?.accessToken}`
)
check(
  'the access token also arrives in the x-access-token header',
  !!login.headers.get('x-access-token')
)

const dashboard = await fetch(`${apiBase}/admin/dashboard`, {
  headers: { Authorization: `Bearer ${loginBody.data?.accessToken}` },
})
check('GET /api/admin/dashboard works for the admin', dashboard.status === 200, `HTTP ${dashboard.status}`)

console.log('\nThrough the Vite proxy (what the browser actually calls)')
const proxied = await (await fetch(`http://localhost:${WEB_PORT}/api/classes`)).json()
check('the frontend proxy reaches the API', proxied.count === 5, `count = ${proxied.count}`)

const page = await fetch(`http://localhost:${WEB_PORT}/`)
check('the frontend page is served', page.status === 200, `HTTP ${page.status}`)

// ---------------------------------------------------------------- 6. cleanup
vite.kill('SIGTERM')
server.close()
mongo.kill('SIGTERM')
rmSync(dbPath, { recursive: true, force: true })

console.log(`\n${failures.length === 0 ? 'SMOKE TEST PASSED' : `SMOKE TEST FAILED: ${failures.join(', ')}`}`)
process.exit(failures.length === 0 ? 0 : 1)
