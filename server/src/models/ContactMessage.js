import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    phone: { type: String, default: '', trim: true },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
    },

    // --- Admin triage -------------------------------------------------------
    status: {
      type: String,
      enum: { values: ['new', 'read', 'replied', 'closed'], message: 'Status must be new, read, replied or closed' },
      default: 'new',
    },
    priority: {
      type: String,
      enum: { values: ['low', 'normal', 'high', 'urgent'], message: 'Priority must be low, normal, high or urgent' },
      default: 'normal',
    },
    reply: { type: String, default: '', trim: true },
    repliedAt: { type: Date, default: null },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

contactMessageSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model('ContactMessage', contactMessageSchema)
