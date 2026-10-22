import mongoose from 'mongoose'

// A scheduled live session for a class cohort (a Friday/Sunday class meeting).
const classSessionSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    title: { type: String, required: [true, 'Session title is required'], trim: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, default: null },
    meetingLink: { type: String, default: '', trim: true },
    telegramChatId: { type: String, default: '', trim: true },
    capacity: { type: Number, default: 0, min: 0 },
    attendedCount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: { values: ['scheduled', 'live', 'completed', 'cancelled'], message: 'Status must be scheduled, live, completed or cancelled' },
      default: 'scheduled',
    },
    recordingUrl: { type: String, default: '', trim: true },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

classSessionSchema.index({ classId: 1, startsAt: 1 })
classSessionSchema.index({ startsAt: 1, status: 1 })

export default mongoose.model('ClassSession', classSessionSchema)
