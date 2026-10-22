import crypto from 'node:crypto'
import { ApiError } from './ApiError.js'

const isProd = process.env.NODE_ENV === 'production'

// Headers that protect the API. Kept deliberately small and explicit rather
// than pulling in a framework, but covers the attacks that matter here:
// framing, sniffing, referrer leakage and an over-permissive CORS.
export function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('X-DNS-Prefetch-Control', 'off')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  if (isProd) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  next()
}

// Rate limiting on a fixed window, keyed by IP. A small in-memory map is
// enough for a single-instance deployment; swap for Redis if the API is
// scaled horizontally.
const buckets = new Map()

export function rateLimit({ windowMs = 60_000, max = 60, message = 'Too many requests, please try again shortly.' } = {}) {
  // Tests exercise the same endpoints many times from one IP, so the limiter
  // is switched off there. It is always on in development and production.
  if (process.env.NODE_ENV === 'test') {
    return (_req, _res, next) => next()
  }

  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || 'unknown'
    const now = Date.now()
    const bucket = buckets.get(key)

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs })
      res.setHeader('X-RateLimit-Limit', max)
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - 1))
      return next()
    }

    bucket.count += 1
    if (bucket.count > max) {
      res.setHeader('Retry-After', Math.ceil((bucket.resetAt - now) / 1000))
      return next(new ApiError(429, message))
    }

    res.setHeader('X-RateLimit-Limit', max)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - bucket.count))
    return next()
  }
}

// Periodic cleanup so the bucket map cannot grow without bound.
const cleanup = setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key)
  }
}, 60_000)
cleanup.unref?.()

// Logs a security-relevant event without ever logging credentials.
export function auditLogin(req, user, outcome) {
  const line = {
    at: new Date().toISOString(),
    event: 'auth',
    outcome,
    userId: user?._id?.toString() || null,
    email: user?.email || null,
    ip: req.ip || null,
    userAgent: req.get('user-agent') || null,
  }
  console.log(`[auth] ${JSON.stringify(line)}`)
}

// Generates a random password for admin-created accounts.
export function temporaryPassword() {
  return crypto.randomBytes(9).toString('base64url')
}
