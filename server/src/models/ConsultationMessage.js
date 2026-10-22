import mongoose from 'mongoose'

// Messages within a consultation thread. Each message records which side
// sent it and whether it has been read.
const consultationMessageSchema = new mongoose.Schema(
  {
    consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
    author: {
      type: String,
      enum: { values: ['customer', 'admin'], message: 'Author must be customer or admin' },
      required: true,
    },
    authorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    body: { type: String, required: [true, 'Message body is required'], trim: true },
    channel: {
      type: String,
      enum: { values: ['portal', 'email', 'whatsapp', 'phone'], message: 'Invalid channel' },
      default: 'portal',
    },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
)

consultationMessageSchema.index({ consultationId: 1, createdAt: 1 })

export default mongoose.model('ConsultationMessage', consultationMessageSchema)
