import mongoose from 'mongoose'

// One row per Paystack webhook event. The unique index on providerEventId is
// what makes webhook handling idempotent: a duplicate delivery fails to
// insert and is ignored, so a replayed event can never double-grant access.
const paymentEventSchema = new mongoose.Schema(
  {
    providerEventId: { type: String, required: true },
    event: { type: String, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    orderReference: { type: String, default: '', trim: true },
    providerReference: { type: String, default: '', trim: true },
    amountKobo: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'NGN', uppercase: true, trim: true },
    status: { type: String, default: '', trim: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: null },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

paymentEventSchema.index({ providerEventId: 1 }, { unique: true })
paymentEventSchema.index({ orderReference: 1 })

export default mongoose.model('PaymentEvent', paymentEventSchema)
