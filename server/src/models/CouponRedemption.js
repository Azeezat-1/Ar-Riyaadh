import mongoose from 'mongoose'

// Records that a user used a coupon. The unique index on couponId + userId
// is what enforces the per-user limit.
const couponRedemptionSchema = new mongoose.Schema(
  {
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    amountKobo: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

couponRedemptionSchema.index({ couponId: 1, userId: 1 }, { unique: true })
couponRedemptionSchema.index({ userId: 1 })

export default mongoose.model('CouponRedemption', couponRedemptionSchema)
