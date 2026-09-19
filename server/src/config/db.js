import 'dotenv/config'
import mongoose from 'mongoose'

const uri = () => {
  const value = process.env.MONGODB_URI
  if (!value) {
    throw new Error('MONGODB_URI is not set. Copy server/.env.example to server/.env and fill it in.')
  }
  return value
}

export async function connectDB() {
  const conn = await mongoose.connect(uri(), { autoIndex: true })
  console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
  return conn
}

// Lazy, reusable connection for serverless contexts (Vercel/Netlify).
// Lives in this package so models and the connection share one mongoose.
let connectionPromise = null

export async function connectDb() {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri(), { autoIndex: true }).catch((err) => {
      connectionPromise = null
      throw err
    })
  }
  return connectionPromise
}