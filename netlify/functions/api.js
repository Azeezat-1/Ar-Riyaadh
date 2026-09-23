// Netlify Functions entry for the Ar-Riyaadh Academy API.
// Mounts the existing Express app via serverless-http and lazy-connects
// MongoDB on first request (connection reused across warm invocations).
import serverless from 'serverless-http'
import expressApp from '../../server/src/app.js'
import { connectDb } from '../../server/src/config/db.js'

const wrapped = serverless(expressApp)

export async function handler(event, context) {
  try {
    await connectDb()
  } catch (err) {
    console.error('[netlify] database connection failed:', err.message)
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Database is momentarily unavailable. Showing saved content.',
      }),
    }
  }
  return wrapped(event, context)
}