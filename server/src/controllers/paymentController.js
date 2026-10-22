import Booking from '../models/Booking.js'
import Coupon from '../models/Coupon.js'
import CouponRedemption from '../models/CouponRedemption.js'
import Enrollment from '../models/Enrollment.js'
import Order from '../models/Order.js'
import PaymentEvent from '../models/PaymentEvent.js'
import Refund from '../models/Refund.js'
import { ApiError } from '../utils/ApiError.js'
import { makeReference } from '../utils/money.js'
import { initializeTransaction, refundTransaction, verifyTransaction, verifyWebhookSignature } from '../services/paystackService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// POST /api/payments/initialize
export const initialize = asyncHandler(async (req, res) => {
  const { orderReference, email, callbackUrl } = req.body

  const order = await Order.findOne({ reference: orderReference })
  if (!order) throw new ApiError(404, 'Order not found')
  if (order.userId && req.user && order.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to pay for this order')
  }
  if (order.status === 'paid') throw new ApiError(409, 'This order has already been paid')

  const paystack = await initializeTransaction({
    email: email || req.user?.email,
    amountKobo: order.totalKobo,
    reference: order.reference,
    callbackUrl: callbackUrl || undefined,
    metadata: { orderId: order._id.toString(), userId: order.userId?.toString() || null },
  })

  order.paystackReference = paystack.reference || ''
  await order.save()

  res.json({
    data: {
      authorizationUrl: paystack.authorization_url,
      accessCode: paystack.access_code,
      reference: paystack.reference,
      amountKobo: order.totalKobo,
    },
  })
})

// POST /api/payments/webhook
// Paystack posts here. The raw body is required to verify the signature, so
// app.js captures it with the express.json verify hook.
export const webhook = asyncHandler(async (req, res) => {
  const signature = req.get('x-paystack-signature')
  const rawBody = req.rawBody

  if (!verifyWebhookSignature(rawBody, signature)) {
    throw new ApiError(401, 'Invalid webhook signature')
  }

  const event = req.body
  const providerEventId = event?.data?.id ? String(event.data.id) : ''

  // The unique index on providerEventId makes this insert the idempotency
  // guard: a replayed delivery fails to insert and is skipped.
  try {
    await PaymentEvent.create({
      providerEventId: providerEventId || `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      event: event.event || 'unknown',
      orderReference: event?.data?.reference || '',
      providerReference: event?.data?.reference || '',
      amountKobo: event?.data?.amount || 0,
      currency: event?.data?.currency || 'NGN',
      status: event?.data?.status || '',
      payload: event,
    })
  } catch (err) {
    if (err?.code === 11000) {
      // Already processed. Acknowledge so Paystack stops retrying.
      return res.json({ received: true, duplicate: true })
    }
    throw err
  }

  if (event.event === 'charge.success') {
    await handleChargeSuccess(event.data)
  }

  res.json({ received: true })
})

async function handleChargeSuccess(data) {
  const order = await Order.findOne({ reference: data.reference })
  if (!order) return

  // Verify with Paystack directly before granting anything. The webhook says
  // what happened; the API says what actually happened.
  const confirmed = await verifyTransaction(data.reference)
  if (confirmed.status !== 'success') return
  if (confirmed.amount !== order.totalKobo) {
    order.status = 'failed'
    await order.save()
    return
  }

  if (order.status === 'paid') return

  order.status = 'paid'
  order.paidAt = new Date()
  await order.save()

  if (order.orderType === 'course_enrollment' && order.classId) {
    await Enrollment.findOneAndUpdate(
      { userId: order.userId, classId: order.classId },
      { $set: { status: 'active', orderId: order._id } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  }

  if (order.orderType === 'service_booking' && order.bookingId) {
    await Booking.findByIdAndUpdate(order.bookingId, { $set: { status: 'confirmed', orderId: order._id } })
  }
}

// POST /api/payments/verify  (client polls this after the redirect)
export const verify = asyncHandler(async (req, res) => {
  const { reference } = req.body
  const order = await Order.findOne({ reference })
  if (!order) throw new ApiError(404, 'Order not found')

  res.json({ data: { reference: order.reference, status: order.status, paidAt: order.paidAt } })
})

// POST /api/payments/orders  (create an order for a class or a service)
export const createOrder = asyncHandler(async (req, res) => {
  const { orderType, classId, bookingId, couponCode } = req.body

  let amountKobo = 0
  let discountKobo = 0
  let taxKobo = 0
  let consultationId = null

  if (orderType === 'course_enrollment') {
    const Class = (await import('../models/Class.js')).default
    const item = await Class.findById(classId)
    if (!item) throw new ApiError(404, 'Class not found')
    amountKobo = item.priceKobo || 0
  } else if (orderType === 'service_booking') {
    const booking = await Booking.findById(bookingId)
    if (!booking) throw new ApiError(404, 'Booking not found')
    amountKobo = booking.amountKobo || 0
  } else if (orderType === 'consultation') {
    const Consultation = (await import('../models/Consultation.js')).default
    const consultation = await Consultation.findById(req.body.consultationId)
    if (!consultation) throw new ApiError(404, 'Consultation not found')
    consultationId = consultation._id
    amountKobo = consultation.priceKobo || 0
  } else {
    throw new ApiError(400, 'Invalid orderType')
  }

  let appliedCoupon = null
  if (couponCode) {
    appliedCoupon = await Coupon.findOne({ code: String(couponCode).toUpperCase(), active: true })
    if (!appliedCoupon) throw new ApiError(400, 'Invalid coupon code')
    const now = new Date()
    if (appliedCoupon.startsAt && now < appliedCoupon.startsAt) throw new ApiError(400, 'This coupon is not active yet')
    if (appliedCoupon.endsAt && now > appliedCoupon.endsAt) throw new ApiError(400, 'This coupon has expired')
    if (appliedCoupon.maxRedemptions > 0 && appliedCoupon.redemptionCount >= appliedCoupon.maxRedemptions) {
      throw new ApiError(400, 'This coupon has reached its redemption limit')
    }
    if (amountKobo < appliedCoupon.minAmountKobo) throw new ApiError(400, 'Order does not meet the minimum amount for this coupon')
    discountKobo = appliedCoupon.percentOff
      ? Math.floor((amountKobo * appliedCoupon.percentOff) / 100)
      : Math.min(appliedCoupon.valueKobo, amountKobo)
  }

  const totalKobo = amountKobo - discountKobo + taxKobo

  const order = await Order.create({
    reference: makeReference('ORD'),
    userId: req.user?._id || null,
    orderType,
    classId: classId || null,
    bookingId: bookingId || null,
    consultationId,
    amountKobo,
    discountKobo,
    taxKobo,
    totalKobo,
    currency: 'NGN',
    couponCode: appliedCoupon?.code || '',
    status: 'pending',
  })

  if (appliedCoupon) {
    await CouponRedemption.create({ couponId: appliedCoupon._id, userId: req.user._id, orderId: order._id, amountKobo: discountKobo })
    await Coupon.updateOne({ _id: appliedCoupon._id }, { $inc: { redemptionCount: 1 } })
  }

  res.status(201).json({ message: 'Order created', data: order })
})

// POST /api/payments/refunds  (admin only)
export const createRefund = asyncHandler(async (req, res) => {
  const { orderId, amountKobo, reason } = req.body

  const order = await Order.findById(orderId)
  if (!order) throw new ApiError(404, 'Order not found')
  if (order.status !== 'paid' && order.status !== 'partially_refunded') {
    throw new ApiError(400, 'Only a paid order can be refunded')
  }
  if (!order.paystackReference) throw new ApiError(400, 'This order has no provider reference to refund against')

  const remaining = order.totalKobo - order.refundedKobo
  if (amountKobo > remaining) throw new ApiError(400, 'Refund amount exceeds the remaining paid amount')

  const provider = await refundTransaction({
    transactionReference: order.paystackReference,
    amountKobo,
    reason,
  })

  const refund = await Refund.create({
    orderId: order._id,
    providerReference: provider?.reference || '',
    amountKobo,
    currency: order.currency,
    reason: reason || '',
    status: provider?.status === 'success' ? 'processed' : 'pending',
    processedBy: req.user._id,
    processedAt: new Date(),
  })

  const refunded = order.refundedKobo + amountKobo
  order.refundedKobo = refunded
  order.status = refunded >= order.totalKobo ? 'refunded' : 'partially_refunded'
  await order.save()

  res.status(201).json({ message: 'Refund recorded', data: refund })
})
