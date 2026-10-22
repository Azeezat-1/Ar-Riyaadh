import mongoose from 'mongoose'

// A discount code. valueKobo is used for fixed-amount discounts and
// percentOff (1-100) for percentage discounts; exactly one is set.
const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: [true, 'Coupon code is required'], trim: true, uppercase: true },
    description: { type: String, default: '', trim: true },
    percentOff: { type: Number, default: 0, min: 0, max: 100 },
    valueKobo: { type: Number, default: 0, min: 0 },
    minAmountKobo: { type: Number, default: 0, min: 0 },
    maxRedemptions: { type: Number, default: 0, min: 0 },
    redemptionCount: { type: Number, default: 0, min: 0 },
    perUserLimit: { type: Number, default: 1, min: 0 },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

couponSchema.index({ code: 1 }, { unique: true })
couponSchema.index({ active: 1, startsAt: 1, endsAt: 1 })

export default mongoose.model('Coupon', couponSchema)
