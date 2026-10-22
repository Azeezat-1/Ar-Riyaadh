// Vercel serverless entry for the Ar-Riyaadh Academy API.
//
// The file is a catch-all (`[...path]`) so that /api/classes, /api/auth/login
// and every other subpath reach this handler with the full URL intact. A
// plain api/index.js only receives /api, and the rewrite that would forward
// the subpath loses it, which turns every route into a 404.
//
// Mounts the existing Express app and lazy-connects MongoDB on first request,
// keeping the connection alive across warm invocations.
import expressApp from '../server/src/app.js'
import { connectDb } from '../server/src/config/db.js'

export default async function handler(req, res) {
  try {
    await connectDb()
  } catch (err) {
    console.error('[vercel] database connection failed:', err.message)
    res.status(503).json({
      message: 'Database is momentarily unavailable. Showing saved content.',
    })
    return
  }
  return expressApp(req, res)
}
