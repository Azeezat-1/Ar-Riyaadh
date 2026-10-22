import mongoose from 'mongoose'

// A lesson inside a class. Ordered within its class by `order`.
const lessonSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    title: { type: String, required: [true, 'Lesson title is required'], trim: true },
    description: { type: String, default: '', trim: true },
    order: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 0, min: 0 },
    type: {
      type: String,
      enum: { values: ['video', 'reading', 'live', 'assignment'], message: 'Type must be video, reading, live or assignment' },
      default: 'video',
    },
    videoUrl: { type: String, default: '', trim: true },
    // Free preview lessons are visible before enrolling.
    isPreview: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    resources: {
      type: [new mongoose.Schema({ title: { type: String, default: '', trim: true }, url: { type: String, default: '', trim: true } }, { _id: false })],
      default: [],
    },
  },
  { timestamps: true }
)

lessonSchema.index({ classId: 1, order: 1 })
lessonSchema.index({ classId: 1, isPublished: 1 })

export default mongoose.model('Lesson', lessonSchema)
