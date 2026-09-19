import 'dotenv/config'
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI is not set. Copy server/.env.example to server/.env and fill it in.')
}

export async function connectDB() {
  const conn = await mongoose.connect(uri, { autoIndex: true })
  console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
  return conn
}