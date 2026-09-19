import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    category: { type: String, default: '', trim: true },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      trim: true,
      minlength: [10, 'Testimonial content must be at least 10 characters'],
    },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Testimonial', testimonialSchema)