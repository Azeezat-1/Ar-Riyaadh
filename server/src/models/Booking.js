import mongoose from 'mongoose'

// A customer's booking of a service slot. The health screening form is
// embedded because it is read and written with the booking and never queried
// independently of it.
const bookingSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceSlot', required: true },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
        message: 'Status must be pending, confirmed, completed, cancelled or no_show',
      },
      default: 'pending',
    },
    // Money in kobo (integer). Frozen at booking time so later price changes
    // never rewrite history.
    amountKobo: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'NGN', uppercase: true, trim: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    notes: { type: String, default: '', trim: true },
    adminNotes: { type: String, default: '', trim: true },
    healthForm: {
      type: new mongoose.Schema(
        {
          conditions: { type: [String], default: [] },
          medications: { type: String, default: '', trim: true },
          allergies: { type: String, default: '', trim: true },
          pregnant: { type: Boolean, default: false },
          recentSurgery: { type: Boolean, default: false },
          bloodPressure: { type: String, default: '', trim: true },
          consentGiven: { type: Boolean, default: false },
          consentedAt: { type: Date, default: null },
          reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
          reviewedAt: { type: Date, default: null },
          cleared: { type: Boolean, default: false },
          reviewNotes: { type: String, default: '', trim: true },
        },
        { _id: false }
      ),
      default: null,
    },
    statusHistory: {
      type: [new mongoose.Schema({ status: { type: String, default: '' }, at: { type: Date, default: Date.now }, by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, note: { type: String, default: '', trim: true } }, { _id: false })],
      default: [],
    },
  },
  { timestamps: true }
)

bookingSchema.index({ reference: 1 }, { unique: true })
bookingSchema.index({ userId: 1, createdAt: -1 })
bookingSchema.index({ slotId: 1, status: 1 })
bookingSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model('Booking', bookingSchema)
