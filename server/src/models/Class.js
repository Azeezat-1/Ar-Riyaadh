import mongoose from 'mongoose'

const classSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Class title is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Class category is required'],
      enum: {
        values: ['Qur\u02bc\u0101n', 'Hadith', 'Tafsir', 'Arabic Language', 'Islamic Studies'],
        message: 'Category must be Qur\u02bc\u0101n, Hadith, Tafsir, Arabic Language or Islamic Studies',
      },
      trim: true,
    },
    icon: { type: String, default: 'book-open', trim: true },
    description: { type: String, required: [true, 'Class description is required'], trim: true },
    audience: { type: String, trim: true },
    focus: { type: [String], default: [] },
    schedule: { type: String, default: 'Live and self-paced options available.', trim: true },
    link: { type: String, default: 'https://wa.me/2348131663860', trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Class', classSchema)