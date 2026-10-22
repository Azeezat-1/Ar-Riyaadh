import mongoose from 'mongoose'

// A bookable time slot for a service. bookedCount is incremented atomically
// with $inc inside a conditional update so two customers cannot oversell the
// same slot.
const serviceSlotSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    capacity: { type: Number, required: [true, 'Capacity is required'], min: [1, 'Capacity must be at least 1'] },
    bookedCount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: { values: ['open', 'closed', 'cancelled'], message: 'Status must be open, closed or cancelled' },
      default: 'open',
    },
    practitioner: { type: String, default: '', trim: true },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

serviceSlotSchema.index({ serviceId: 1, startsAt: 1 })
serviceSlotSchema.index({ startsAt: 1, status: 1 })

export default mongoose.model('ServiceSlot', serviceSlotSchema)
