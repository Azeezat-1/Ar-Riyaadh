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

    // --- Optional link to the student account that submitted it -----------
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    rating: { type: Number, default: 5, min: [1, 'Rating must be between 1 and 5'], max: [5, 'Rating must be between 1 and 5'] },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

testimonialSchema.index({ approved: 1, displayOrder: 1 })

export default mongoose.model('Testimonial', testimonialSchema)
