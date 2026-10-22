import mongoose from 'mongoose'

// A refund issued against a paid order.
const refundSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    providerReference: { type: String, default: '', trim: true },
    amountKobo: { type: Number, required: [true, 'Refund amount is required'], min: [1, 'Refund amount must be greater than zero'] },
    currency: { type: String, default: 'NGN', uppercase: true, trim: true },
    reason: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: { values: ['pending', 'processed', 'failed'], message: 'Invalid refund status' },
      default: 'pending',
    },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    processedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

refundSchema.index({ orderId: 1, createdAt: -1 })
refundSchema.index({ status: 1 })

export default mongoose.model('Refund', refundSchema)
