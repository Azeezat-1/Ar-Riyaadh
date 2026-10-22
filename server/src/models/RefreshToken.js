import mongoose from 'mongoose'

// Rotating refresh tokens. Each token belongs to a "family"; when a token is
// used it is revoked and replaced. If an already-used token is presented
// again, the whole family is revoked, which is the signal that a token was
// stolen and replayed.
const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true, unique: true },
    familyId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    replacedBy: { type: String, default: '', trim: true },
    userAgent: { type: String, default: '', trim: true },
    ip: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
refreshTokenSchema.index({ userId: 1 })
refreshTokenSchema.index({ familyId: 1 })

export default mongoose.model('RefreshToken', refreshTokenSchema)
