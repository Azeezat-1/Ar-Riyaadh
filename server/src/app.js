import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import apiRoutes from './routes/index.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import { rateLimit, securityHeaders } from './utils/security.js'

const app = express()

app.set('trust proxy', 1)

// Security headers on every response.
app.use(securityHeaders)

// Broad rate limit. Per-route limits (login, registration, consultation)
// tighten this further where it matters.
app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 300 }))

app.use(cors({ origin: corsOrigins() }))

// The Paystack webhook signature is an HMAC of the RAW body, so the raw
// bytes are kept before the JSON parser rewrites them.
app.use(
  express.json({
    limit: '100kb',
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString('utf8')
    },
  })
)
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

app.get('/', (_req, res) => {
  res.json({
    name: 'Ar-Riyaadh Academy API',
    version: '0.2.0',
    endpoints: {
      classes: '/api/classes',
      lectures: '/api/lectures',
      testimonials: '/api/testimonials',
      articles: '/api/homeschooling',
      contact: '/api/contact',
      auth: '/api/auth',
      enrollments: '/api/enrollments',
      services: '/api/services',
      bookings: '/api/bookings',
      consultations: '/api/consultations',
      payments: '/api/payments',
      me: '/api/me',
      admin: '/api/admin',
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
