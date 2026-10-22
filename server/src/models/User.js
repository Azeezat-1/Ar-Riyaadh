import crypto from 'node:crypto'
import mongoose from 'mongoose'

const ROLES = ['student', 'customer', 'admin']

// Password hashing uses Node's built-in scrypt, so the project needs no
// native crypto dependency. Format: scrypt$<salt b64>$<hash b64>.
const KEY_LENGTH = 64

export function hashPassword(plain) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16)
    crypto.scrypt(plain, salt, KEY_LENGTH, (err, derived) => {
      if (err) return reject(err)
      resolve(`scrypt$${salt.toString('base64')}$${derived.toString('base64')}`)
    })
  })
}

export function verifyPassword(plain, stored) {
  return new Promise((resolve) => {
    if (typeof stored !== 'string') return resolve(false)
    const parts = stored.split('$')
    if (parts.length !== 3 || parts[0] !== 'scrypt') return resolve(false)
    const salt = Buffer.from(parts[1], 'base64')
    const expected = Buffer.from(parts[2], 'base64')
    crypto.scrypt(plain, salt, expected.length, (err, derived) => {
      if (err) return resolve(false)
      resolve(crypto.timingSafeEqual(derived, expected))
    })
  })
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    // scrypt hash. `select: false` keeps it out of every query by default so
    // it can never be leaked by accident through a response body.
    passwordHash: { type: String, required: [true, 'Password is required'], select: false },
    name: { type: String, required: [true, 'Name is required'], trim: true },
    phone: { type: String, default: '', trim: true },
    roles: {
      type: [String],
      enum: { values: ROLES, message: `Role must be one of ${ROLES.join(', ')}` },
      default: ['student'],
    },
    status: {
      type: String,
      enum: { values: ['active', 'suspended', 'pending'], message: 'Status must be active, suspended or pending' },
      default: 'active',
    },
    emailVerified: { type: Boolean, default: false },
    telegramChatId: { type: String, default: '', trim: true },
    lastLoginAt: { type: Date, default: null },
    failedLoginAttempts: { type: Number, default: 0, min: 0 },
    lockedUntil: { type: Date, default: null },
    profile: {
      type: new mongoose.Schema(
        {
          bio: { type: String, default: '', trim: true },
          country: { type: String, default: '', trim: true },
          ageGroup: { type: String, default: '', trim: true },
          emergencyContact: { type: String, default: '', trim: true },
        },
        { _id: false }
      ),
      default: () => ({}),
    },
  },
  { timestamps: true }
)

userSchema.index({ roles: 1, status: 1 })
userSchema.index({ createdAt: -1 })

// Instance helper for verifying a plaintext password against the stored hash.
userSchema.methods.verifyPassword = function verifyPassword(plain) {
  return verifyPassword(plain, this.passwordHash)
}

export default mongoose.model('User', userSchema)
export { ROLES }
