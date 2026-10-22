import mongoose from 'mongoose'

// Access tokens are opaque random strings stored hashed. MongoDB's TTL index
// removes expired documents automatically, so no cleanup job is needed.
const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // sha256 of the token. The raw token only ever exists in the client.
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    userAgent: { type: String, default: '', trim: true },
    ip: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

// TTL index: MongoDB deletes the document once expiresAt passes.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
sessionSchema.index({ userId: 1 })

export default mongoose.model('Session', sessionSchema)
