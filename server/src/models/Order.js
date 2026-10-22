import mongoose from 'mongoose'

// A payment order. Money is stored in kobo (integer) so arithmetic never
// drifts, and the currency code travels with every amount.
const orderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    orderType: {
      type: String,
      enum: {
        values: ['course_enrollment', 'service_booking', 'consultation', 'subscription'],
        message: 'Invalid orderType',
      },
      required: true,
    },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', default: null },
    amountKobo: { type: Number, required: true, min: [0, 'amountKobo cannot be negative'] },
    discountKobo: { type: Number, default: 0, min: 0 },
    taxKobo: { type: Number, default: 0, min: 0 },
    totalKobo: { type: Number, required: true, min: [0, 'totalKobo cannot be negative'] },
    refundedKobo: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'NGN', uppercase: true, trim: true },
    couponCode: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
        message: 'Invalid order status',
      },
      default: 'pending',
    },
    paystackReference: { type: String, default: '', trim: true },
    accessUrl: { type: String, default: '', trim: true },
    paidAt: { type: Date, default: null },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

orderSchema.index({ reference: 1 }, { unique: true })
orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ status: 1, createdAt: -1 })
orderSchema.index({ paystackReference: 1 })

export default mongoose.model('Order', orderSchema)
