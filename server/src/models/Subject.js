import mongoose from 'mongoose'

// Subject taxonomy for classes (Qur'an, Hadith, Arabic, Islamic Studies...).
const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Subject name is required'], trim: true, unique: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '', trim: true },
    icon: { type: String, default: 'book-open', trim: true },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

subjectSchema.index({ active: 1, displayOrder: 1 })

export default mongoose.model('Subject', subjectSchema)
