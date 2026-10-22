import Session from '../models/Session.js'
import RefreshToken from '../models/RefreshToken.js'
import User, { hashPassword, verifyPassword } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { auditLogin, temporaryPassword } from '../utils/security.js'
import { hashToken, randomToken } from '../utils/money.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const ACCESS_TTL_MS = 15 * 60 * 1000 // 15 minutes
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

// The user object as the API returns it. Never includes the password hash.
export function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    roles: user.roles,
    status: user.status,
    emailVerified: user.emailVerified,
    telegramChatId: user.telegramChatId,
    profile: user.profile,
    createdAt: user.createdAt,
  }
}

async function issueSession(user, req, res, { familyId = null } = {}) {
  const accessToken = randomToken(32)
  const refreshToken = randomToken(48)

  await Session.create({
    userId: user._id,
    tokenHash: hashToken(accessToken),
    expiresAt: new Date(Date.now() + ACCESS_TTL_MS),
    userAgent: req.get('user-agent') || '',
    ip: req.ip || '',
  })

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    familyId: familyId || randomToken(16),
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    userAgent: req.get('user-agent') || '',
    ip: req.ip || '',
  })

  res.setHeader('X-Access-Token', accessToken)
  res.setHeader('X-Refresh-Token', refreshToken)
  return { accessToken, refreshToken }
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { email, password, name, phone } = req.body

  const existing = await User.findOne({ email: String(email).toLowerCase() })
  if (existing) throw new ApiError(409, 'An account with this email already exists')

  const user = await User.create({
    email,
    name,
    phone: phone || '',
    // A public registration can never grant itself the admin role.
    roles: ['student'],
    passwordHash: await hashPassword(password),
  })

  const tokens = await issueSession(user, req, res)
  auditLogin(req, user, 'register')
  res
    .status(201)
    .json({ message: 'Account created', data: { ...publicUser(user), ...tokens } })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+passwordHash')
  if (!user) {
    auditLogin(req, null, 'unknown_email')
    throw new ApiError(401, 'Invalid email or password')
  }

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    throw new ApiError(423, 'Account is temporarily locked. Please try again later.')
  }

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) {
    user.failedLoginAttempts += 1
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCKOUT_MS)
      user.failedLoginAttempts = 0
    }
    await user.save()
    auditLogin(req, user, 'bad_password')
    throw new ApiError(401, 'Invalid email or password')
  }

  user.failedLoginAttempts = 0
  user.lockedUntil = null
  user.lastLoginAt = new Date()
  await user.save()

  const tokens = await issueSession(user, req, res)
  auditLogin(req, user, 'success')
  res.json({ message: 'Signed in', data: { ...publicUser(user), ...tokens } })
})

// POST /api/auth/refresh
export const refresh = asyncHandler(async (req, res) => {
  const raw = req.body?.refreshToken
  if (!raw) throw new ApiError(400, 'refreshToken is required')

  const tokenHash = hashToken(raw)
  const stored = await RefreshToken.findOne({ tokenHash })
  if (!stored) throw new ApiError(401, 'Invalid refresh token')

  // A revoked token being presented again means the token was replayed:
  // revoke the whole family and force a fresh sign-in.
  if (stored.revokedAt) {
    await RefreshToken.updateMany({ familyId: stored.familyId }, { revokedAt: new Date() })
    throw new ApiError(401, 'Session expired. Please sign in again.')
  }
  if (stored.expiresAt.getTime() < Date.now()) {
    throw new ApiError(401, 'Session expired. Please sign in again.')
  }

  const user = await User.findById(stored.userId)
  if (!user || user.status !== 'active') throw new ApiError(401, 'Account is not active')

  stored.revokedAt = new Date()
  await stored.save()

  const tokens = await issueSession(user, req, res, { familyId: stored.familyId })
  const replacement = await RefreshToken.findOne({ userId: user._id, revokedAt: null, familyId: stored.familyId })
  if (replacement) stored.replacedBy = replacement.tokenHash
  await stored.save()

  res.json({ message: 'Session refreshed', data: { ...publicUser(user), ...tokens } })
})

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  const raw = req.body?.refreshToken
  if (raw) {
    await RefreshToken.updateOne({ tokenHash: hashToken(raw) }, { revokedAt: new Date() })
  }
  res.json({ message: 'Signed out' })
})

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  res.json({ data: publicUser(req.user) })
})

// PATCH /api/auth/me
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, telegramChatId, profile } = req.body
  const update = {}
  if (name !== undefined) update.name = name
  if (phone !== undefined) update.phone = phone
  if (telegramChatId !== undefined) update.telegramChatId = telegramChatId
  if (profile !== undefined) update.profile = profile

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true })
  res.json({ message: 'Profile updated', data: publicUser(user) })
})

// POST /api/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const user = await User.findById(req.user._id).select('+passwordHash')
  const ok = await verifyPassword(currentPassword, user.passwordHash)
  if (!ok) throw new ApiError(400, 'Current password is incorrect')

  user.passwordHash = await hashPassword(newPassword)
  await user.save()

  // Changing the password ends every other session for this account.
  await Session.deleteMany({ userId: user._id })
  await RefreshToken.updateMany({ userId: user._id, revokedAt: null }, { revokedAt: new Date() })

  res.json({ message: 'Password changed. Please sign in again.' })
})

// POST /api/auth/admin/users  (admin only)
export const adminCreateUser = asyncHandler(async (req, res) => {
  const { email, name, phone, roles } = req.body
  const existing = await User.findOne({ email: String(email).toLowerCase() })
  if (existing) throw new ApiError(409, 'An account with this email already exists')

  const safeRoles = (roles || ['student']).filter((role) => ['student', 'customer', 'admin'].includes(role))
  const user = await User.create({
    email,
    name,
    phone: phone || '',
    roles: safeRoles.length ? safeRoles : ['student'],
    passwordHash: await hashPassword(temporaryPassword()),
  })

  res.status(201).json({ message: 'User created', data: publicUser(user) })
})
