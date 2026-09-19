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
      enum: {
        values: ['Ongoing', 'Upcoming', 'Completed'],
        message: 'Status must be Ongoing, Upcoming or Completed',
      },
      default: 'Upcoming',
    },
    image: { type: String, default: '', trim: true },
    accessLink: { type: String, default: '#', trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('Lecture', lectureSchema)