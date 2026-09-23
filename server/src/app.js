import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import apiRoutes from './routes/index.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors({ origin: corsOrigins() }))
app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

app.get('/', (_req, res) => {
  res.json({
    name: 'Ar-Riyaadh Academy API',
    version: '0.1.0',
    endpoints: {
      classes: '/api/classes',
      lectures: '/api/lectures',
      testimonials: '/api/testimonials',
      articles: '/api/homeschooling',
      contact: '/api/contact',
      health: '/api/health',
    },
  })
})

app.use('/api', apiRoutes)

app.use(notFound)
app.use(errorHandler)

function corsOrigins() {
  const raw = (process.env.CORS_ORIGINS || 'http://localhost:5173').trim()
  if (raw === '*') return true
  return raw.split(',').map((o) => o.trim())
}

export default app