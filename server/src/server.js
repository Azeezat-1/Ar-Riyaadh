import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 4000

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`[server] Ar-Riyadh Academy API running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('[server] failed to start:', err.message)
  process.exit(1)
})