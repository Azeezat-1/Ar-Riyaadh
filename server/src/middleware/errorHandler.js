import { ApiError } from '../utils/ApiError.js'

// 404 for unknown API routes.
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

// Central error handler — single place that shapes every error response.
export const errorHandler = (err, req, res, _next) => {
  let { statusCode = 500, message = 'Server error' } = err

  // Mongoose / Mongo errors mapped to meaningful HTTP responses.
  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid identifier format'
  } else if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
  } else if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    message = `A record with this ${field} already exists`
  }

  if (statusCode >= 500 && !err.isOperational) {
    console.error('[error]', err)
  }

  const body = { message }
  if (err.details) body.details = err.details
  if (process.env.NODE_ENV !== 'production' && statusCode >= 500) body.stack = err.stack

  res.status(statusCode).json(body)
}