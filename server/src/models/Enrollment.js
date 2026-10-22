import mongoose from 'mongoose'

// A student's enrolment in a class. Progress is stored as a map of
// lessonId -> completed flag, which keeps the document small and lets a
// single read return the whole progress state.
const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    status: {
      type: String,
      enum: {
        values: ['pending', 'active', 'paused', 'completed', 'expired', 'cancelled'],
        message: 'Status must be pending, active, paused, completed, expired or cancelled',
      },
      default: 'pending',
    },
    accessType: {
      type: String,
      enum: { values: ['free', 'paid', 'complimentary', 'scholarship'], message: 'Invalid accessType' },
      default: 'free',
    },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    // lessonId -> boolean. Kept as a Map so the document stays small.
    completedLessons: { type: Map, of: Boolean, default: () => new Map() },
    lessonsCompleted: { type: Number, default: 0, min: 0 },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    // Per-enrolment Telegram invite. Overrides class.telegramChannel when set,
    // so an admin can issue an individual invite to one student.
    telegramLink: { type: String, default: '', trim: true },
    telegramChatId: { type: String, default: '', trim: true },
    telegramInviteSentAt: { type: Date, default: null },
    enrolledAt: { type: Date, default: Date.now },
    startedAt: { type: Date, default: null },
    lastAccessedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    notes: { type: String, default: '', trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

// One active enrolment per user per class.
enrollmentSchema.index({ userId: 1, classId: 1 }, { unique: true })
enrollmentSchema.index({ classId: 1, status: 1 })
enrollmentSchema.index({ userId: 1, status: 1 })
enrollmentSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model('Enrollment', enrollmentSchema)
