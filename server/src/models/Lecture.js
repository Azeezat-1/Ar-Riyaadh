import mongoose from 'mongoose'

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Lecture title is required'], trim: true },
    description: { type: String, default: '', trim: true },
    topic: { type: String, default: '', trim: true },
    tags: { type: [String], default: [] },
    schedule: { type: String, default: 'Friday / Sunday sessions', trim: true },
    audience: { type: String, default: 'Sisters / Muslimahs', trim: true },
    status: {
      type: String,
      enum: { values: ['Ongoing', 'Upcoming', 'Completed'], message: 'Status must be Ongoing, Upcoming or Completed' },
      default: 'Upcoming',
    },
    image: { type: String, default: '', trim: true },
    accessLink: { type: String, default: '#', trim: true },

    // --- Links to the enrolled course --------------------------------------
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
    sessionNumber: { type: Number, default: 0, min: 0 },
    startsAt: { type: Date, default: null },
    durationMinutes: { type: Number, default: 0, min: 0 },
    isRecorded: { type: Boolean, default: false },
    recordingUrl: { type: String, default: '', trim: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

lectureSchema.index({ classId: 1, sessionNumber: 1 })
lectureSchema.index({ status: 1, startsAt: -1 })

export default mongoose.model('Lecture', lectureSchema)
