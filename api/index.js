// Vercel serverless entry for the Ar-Riyaadh Academy API.
// Mounts the existing Express app and lazy-connects MongoDB on first
// request, keeping the connection alive across warm invocations.
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