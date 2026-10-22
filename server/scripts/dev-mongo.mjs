/**
 * Starts a local MongoDB for development.
 *
 * There is no MongoDB installed on this machine, but `mongodb-memory-server`
 * has already downloaded a real `mongod` binary. This script runs that binary
 * as a normal, persistent server on the default port with a fixed data
 * directory, so the data survives between runs.
 *
 * Usage:
 *   node scripts/dev-mongo.mjs          # start (Ctrl+C to stop)
 *   node scripts/dev-mongo.mjs --fresh  # wipe the data directory first
 *
 * Then point the API at it:
 *   MONGODB_URI=mongodb://127.0.0.1:27017/ar-riyadh npm run seed
 *   MONGODB_URI=mongodb://127.0.0.1:27017/ar-riyadh npm start
 */

import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const PORT = Number(process.env.MONGODB_DEV_PORT || 27017)
const DB_PATH = join(homedir(), '.ar-riyadh-mongo')
const DB_NAME = 'ar-riyadh'
const CACHE_DIRS = [
  join(homedir(), '.cache', 'mongodb-binaries'),
  join(homedir(), 'Library', 'Caches', 'mongodb-binaries'),
]

function findMongod() {
  for (const dir of CACHE_DIRS) {
    if (!existsSync(dir)) continue
    const binary = readdirSync(dir).find((f) => f.startsWith('mongod'))
    if (binary) return join(dir, binary)
  }
  return null
}

const mongod = findMongod()
if (!mongod) {
  console.error('No mongod binary found. Run `npm test` once so mongodb-memory-server downloads one.')
  process.exit(1)
}

if (process.argv.includes('--fresh') && existsSync(DB_PATH)) {
  rmSync(DB_PATH, { recursive: true, force: true })
  console.log('[dev-mongo] data directory wiped')
}
mkdirSync(DB_PATH, { recursive: true })

// Fail early with a clear message if something already holds the port.
const portCheck = spawnSync('lsof', ['-ti', `tcp:${PORT}`], { encoding: 'utf8' })
if (portCheck.stdout.trim()) {
  console.error(`[dev-mongo] port ${PORT} is already in use. Stop that process or set MONGODB_DEV_PORT.`)
  process.exit(1)
}

console.log(`[dev-mongo] starting mongod on port ${PORT} (data: ${DB_PATH})`)
const child = spawn(
  mongod,
  ['--dbpath', DB_PATH, '--port', String(PORT), '--bind_ip', '127.0.0.1'],
  { stdio: ['ignore', 'pipe', 'pipe'] }
)

child.stdout.on('data', (d) => {
  const text = String(d)
  if (text.includes('Waiting for connections')) {
    console.log(`\n[dev-mongo] ready.\n`)
    console.log(`  MONGODB_URI=mongodb://127.0.0.1:${PORT}/${DB_NAME}\n`)
    console.log('  npm run seed')
    console.log('  npm start\n')
  }
})
child.stderr.on('data', (d) => process.stderr.write(`[dev-mongo] ${d}`))

const stop = () => {
  child.kill('SIGTERM')
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
child.on('exit', (code) => process.exit(code ?? 0))
