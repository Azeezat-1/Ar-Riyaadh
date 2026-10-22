import mongoose from 'mongoose'
import { ApiError } from '../utils/ApiError.js'
import { hashToken } from '../utils/money.js'
import Session from '../models/Session.js'
import User from '../models/User.js'

// Reads the bearer token from the Authorization header.
export function readToken(req) {
  const header = req.get('authorization') || ''
  if (!header.startsWith('Bearer ')) return null
  const token = header.slice(7).trim()
  return token || null
}

// Verifies a bearer token and loads the owning user onto req.user.
// Returns null when the token is missing or invalid; never throws.
export async function resolveUser(req) {
  const token = readToken(req)
  if (!token) return null

  const session = await Session.findOne({ tokenHash: hashToken(token) })
  if (!session) return null
  if (session.expiresAt.getTime() < Date.now()) return null

  const user = await User.findById(session.userId)
  if (!user || user.status !== 'active') return null
  return user
}

// Hard gate for protected routes.
export const requireAuth = async (req, _res, next) => {
  try {
    const user = await resolveUser(req)
    if (!user) return next(new ApiError(401, 'Authentication required'))
    req.user = user
    return next()
  } catch (err) {
    return next(err)
  }
}

// Attaches req.user when a valid token is present, but never blocks the
// request. Used on endpoints that are public but personalise when signed in.
export const optionalAuth = async (req, _res, next) => {
  try {
    const user = await resolveUser(req)
    if (user) req.user = user
    return next()
  } catch {
    return next()
  }
}

// Role gate. Usage: requireRole('admin') or requireRole('admin', 'student').
export const requireRole =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'))
    if (!roles.some((role) => req.user.roles.includes(role))) {
      return next(new ApiError(403, 'You do not have permission to perform this action'))
    }
    return next()
  }

// Same as requireRole but self-service: the user always passes for their own
// resource. Used for /api/me routes.
export const requireSelfOrRole = (paramName) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, 'Authentication required'))
  const target = req.params[paramName]
  if (req.user.roles.includes('admin') || target === req.user._id.toString()) {
    return next()
  }
  return next(new ApiError(403, 'You do not have permission to perform this action'))
}

// Rejects a request that is not a well-formed ObjectId before it reaches a
// query. Mongoose would throw a CastError otherwise.
export function validObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}
