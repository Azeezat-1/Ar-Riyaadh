import mongoose from 'mongoose'

// A bookable service, such as a Hijama (cupping therapy) appointment.
// Distinct from a Class: a class is learning content, a service is a
// scheduled appointment with a practitioner.
const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Service title is required'], trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: {
      type: String,
      enum: { values: ['hijama', 'consultation', 'other'], message: 'Category must be hijama, consultation or other' },
      default: 'other',
    },
    description: { type: String, default: '', trim: true },
    durationMinutes: { type: Number, required: [true, 'Duration is required'], min: [5, 'Duration must be at least 5 minutes'] },
    // Money in kobo (integer) to avoid floating point drift.
    priceKobo: { type: Number, default: 0, min: [0, 'priceKobo cannot be negative'] },
    currency: { type: String, default: 'NGN', uppercase: true, trim: true },
    capacityPerSlot: { type: Number, default: 1, min: [1, 'capacityPerSlot must be at least 1'] },
    requiresHealthForm: { type: Boolean, default: false },
    preparationNotes: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    image: { type: String, default: '', trim: true },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

serviceSchema.index({ active: 1, category: 1 })

export default mongoose.model('Service', serviceSchema)
