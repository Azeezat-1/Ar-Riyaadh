import mongoose from 'mongoose'

// In-app notification for a user. readAt === null means unread.
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, default: 'general', trim: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    body: { type: String, default: '', trim: true },
    link: { type: String, default: '', trim: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
)

notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)
