import Booking from '../models/Booking.js'
import Service from '../models/Service.js'
import ServiceSlot from '../models/ServiceSlot.js'
import { ApiError } from '../utils/ApiError.js'
import { makeReference } from '../utils/money.js'
import { recordAudit } from '../middleware/audit.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/services  (public catalogue)
export const listServices = asyncHandler(async (req, res) => {
  const filter = { active: true }
  if (req.query.category) filter.category = req.query.category

  const services = await Service.find(filter).sort({ displayOrder: 1, title: 1 })
  res.json({ count: services.length, data: services })
})

// GET /api/services/:id
export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) throw new ApiError(404, 'Service not found')
  res.json({ data: service })
})

// GET /api/services/:id/slots  (available slots for a service)
export const listSlots = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) throw new ApiError(404, 'Service not found')

  const slots = await ServiceSlot.find({
    serviceId: service._id,
    status: 'open',
    startsAt: { $gte: new Date() },
  })
    .sort({ startsAt: 1 })
    .select('-notes')

  // Hide slots that are already full rather than offering them.
  const available = slots.filter((slot) => slot.bookedCount < slot.capacity)
  res.json({ count: available.length, data: available })
})

// POST /api/bookings  (create a booking)
export const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, slotId, notes, healthForm } = req.body

  const service = await Service.findById(serviceId)
  if (!service) throw new ApiError(404, 'Service not found')
  if (!service.active) throw new ApiError(400, 'This service is not currently available')

  const slot = await ServiceSlot.findById(slotId)
  if (!slot) throw new ApiError(404, 'Slot not found')
  if (slot.serviceId.toString() !== service._id.toString()) throw new ApiError(400, 'Slot does not belong to that service')
  if (slot.startsAt.getTime() < Date.now()) throw new ApiError(400, 'That slot is in the past')
  if (slot.status !== 'open') throw new ApiError(400, 'That slot is not open for booking')

  if (service.requiresHealthForm) {
    if (!healthForm || healthForm.consentGiven !== true) {
      throw new ApiError(400, 'The health screening form and consent are required for this service')
    }
  }

  // Reserve the place atomically. The filter requires bookedCount to still be
  // below capacity, so two simultaneous requests cannot oversell the slot.
  const reserved = await ServiceSlot.findOneAndUpdate(
    { _id: slot._id, status: 'open', $expr: { $lt: ['$bookedCount', '$capacity'] } },
    { $inc: { bookedCount: 1 } },
    { new: true }
  )
  if (!reserved) throw new ApiError(409, 'That slot has just been taken. Please choose another.')

  const booking = await Booking.create({
    reference: makeReference('BKG'),
    userId: req.user?._id || null,
    serviceId: service._id,
    slotId: slot._id,
    status: 'pending',
    amountKobo: service.priceKobo || 0,
    currency: service.currency,
    notes: notes || '',
    healthForm: service.requiresHealthForm
      ? {
          ...healthForm,
          consentGiven: true,
          consentedAt: new Date(),
        }
      : null,
    statusHistory: [{ status: 'pending', at: new Date(), by: req.user?._id || null, note: 'Booking created' }],
  })

  res.status(201).json({ message: 'Booking created', data: booking })
})

// GET /api/bookings  (the signed-in customer's bookings)
export const listMine = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate('serviceId', 'title category durationMinutes')
    .populate('slotId', 'startsAt endsAt')
    .sort({ createdAt: -1 })
  res.json({ count: bookings.length, data: bookings })
})

// GET /api/bookings/:id
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('serviceId', 'title category durationMinutes preparationNotes')
    .populate('slotId', 'startsAt endsAt practitioner')
  if (!booking) throw new ApiError(404, 'Booking not found')
  if (booking.userId && booking.userId.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
    throw new ApiError(403, 'You do not have permission to view this booking')
  }
  res.json({ data: booking })
})

// POST /api/bookings/:id/cancel
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
  if (!booking) throw new ApiError(404, 'Booking not found')
  if (booking.userId && booking.userId.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
    throw new ApiError(403, 'You do not have permission to cancel this booking')
  }
  if (['cancelled', 'completed'].includes(booking.status)) {
    throw new ApiError(400, `A ${booking.status} booking cannot be cancelled`)
  }

  booking.status = 'cancelled'
  booking.statusHistory.push({ status: 'cancelled', at: new Date(), by: req.user._id, note: req.body.reason || '' })
  await booking.save()

  // Give the place back to the slot.
  await ServiceSlot.updateOne({ _id: booking.slotId, bookedCount: { $gt: 0 } }, { $inc: { bookedCount: -1 } })

  res.json({ message: 'Booking cancelled', data: booking })
})

// POST /api/admin/bookings/:id/status  (admin only)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body

  const booking = await Booking.findById(req.params.id)
  if (!booking) throw new ApiError(404, 'Booking not found')

  const before = { status: booking.status }
  booking.status = status
  booking.statusHistory.push({ status, at: new Date(), by: req.user._id, note: note || '' })
  if (note) booking.adminNotes = note
  await booking.save()

  recordAudit(req, { action: 'booking.status', entity: 'Booking', entityId: booking._id, before, after: { status } })
  res.json({ message: 'Booking updated', data: booking })
})

// POST /api/admin/bookings/:id/health-review  (admin only)
// A Hijama appointment cannot be completed until the health screening has
// been reviewed and cleared.
export const reviewHealthForm = asyncHandler(async (req, res) => {
  const { cleared, notes } = req.body

  const booking = await Booking.findById(req.params.id)
  if (!booking) throw new ApiError(404, 'Booking not found')
  if (!booking.healthForm) throw new ApiError(400, 'This booking has no health form')

  booking.healthForm.cleared = cleared === true
  booking.healthForm.reviewNotes = notes || ''
  booking.healthForm.reviewedBy = req.user._id
  booking.healthForm.reviewedAt = new Date()
  await booking.save()

  recordAudit(req, { action: 'booking.health_review', entity: 'Booking', entityId: booking._id })
  res.json({ message: 'Health form reviewed', data: booking })
})

// GET /api/admin/services
// POST /api/admin/services
// PUT /api/admin/services/:id
// DELETE /api/admin/services/:id
export const adminListServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ displayOrder: 1, title: 1 })
  res.json({ count: services.length, data: services })
})

export const adminCreateService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body)
  recordAudit(req, { action: 'service.create', entity: 'Service', entityId: service._id })
  res.status(201).json({ message: 'Service created', data: service })
})

export const adminUpdateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!service) throw new ApiError(404, 'Service not found')
  recordAudit(req, { action: 'service.update', entity: 'Service', entityId: service._id })
  res.json({ message: 'Service updated', data: service })
})

export const adminDeleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id)
  if (!service) throw new ApiError(404, 'Service not found')
  recordAudit(req, { action: 'service.delete', entity: 'Service', entityId: service._id })
  res.status(204).end()
})

// POST /api/admin/services/:id/slots
export const adminCreateSlot = asyncHandler(async (req, res) => {
  const { startsAt, endsAt, capacity, practitioner, notes } = req.body

  const service = await Service.findById(req.params.id)
  if (!service) throw new ApiError(404, 'Service not found')

  const slot = await ServiceSlot.create({
    serviceId: service._id,
    startsAt,
    endsAt,
    capacity: capacity || service.capacityPerSlot || 1,
    practitioner: practitioner || '',
    notes: notes || '',
  })
  res.status(201).json({ message: 'Slot created', data: slot })
})
