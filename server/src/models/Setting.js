import mongoose from 'mongoose'

// Key/value settings such as the support email, Telegram links or the
// academy's WhatsApp number. Read through a cached helper so a settings
// lookup never hits the database on every request.
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: [true, 'Setting key is required'], trim: true },
    value: { type: mongoose.Schema.Types.Mixed, default: '' },
    description: { type: String, default: '', trim: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

settingSchema.index({ key: 1 }, { unique: true })

export default mongoose.model('Setting', settingSchema)
