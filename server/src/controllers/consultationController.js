import Consultation from '../models/Consultation.js'
import ConsultationMessage from '../models/ConsultationMessage.js'
import { ApiError } from '../utils/ApiError.js'
import { makeReference } from '../utils/money.js'
import { recordAudit } from '../middleware/audit.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// SLA per priority, in hours. A consultation is expected to get a first
// response inside its window.
const SLA_HOURS = { urgent: 2, high: 8, normal: 24, low: 72 }

function responseDueAt(priority) {
  return new Date(Date.now() + (SLA_HOURS[priority] ?? SLA_HOURS.normal) * 60 * 60 * 1000)
}

// POST /api/consultations  (open to the public, with or without an account)
export const createConsultation = asyncHandler(async (req, res) => {
  const { subject, category, priority, preferredChannel, guestName, guestEmail, guestPhone, message } = req.body

  // A signed-in user is identified by their token, so the guest fields fall
  // back to their profile. A guest must supply at least an email address.
  const name = req.user ? req.user.name : guestName || ''
  const email = req.user ? req.user.email : guestEmail || ''

  if (!email) {
    throw new ApiError(400, 'Please provide an email address so we can reply')
  }

  const consultation = await Consultation.create({
    reference: makeReference('CON'),
    userId: req.user?._id || null,
    guestName: name,
    guestEmail: email,
    guestPhone: req.user ? req.user.phone || '' : guestPhone || '',
    subject,
    category: category || 'general',
    priority: priority || 'normal',
    preferredChannel: preferredChannel || 'portal',
    responseDueAt: responseDueAt(priority || 'normal'),
  })

  if (message) {
    await ConsultationMessage.create({
      consultationId: consultation._id,
      author: 'customer',
      authorUserId: req.user?._id || null,
      body: message,
      channel: 'portal',
    })
  }

  res.status(201).json({ message: 'Consultation received', data: consultation })
})

// GET /api/consultations  (the signed-in customer's consultations)
export const listMine = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find({ userId: req.user._id }).sort({ createdAt: -1 })
  res.json({ count: consultations.length, data: consultations })
})

// GET /api/consultations/:id
export const getConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id)
  if (!consultation) throw new ApiError(404, 'Consultation not found')

  const isOwner = consultation.userId && consultation.userId.toString() === req.user._id.toString()
  const isAdmin = req.user.roles.includes('admin')
  if (!isOwner && !isAdmin) throw new ApiError(403, 'You do not have permission to view this consultation')

  const messages = await ConsultationMessage.find({ consultationId: consultation._id }).sort({ createdAt: 1 })
  res.json({ data: { ...consultation.toObject(), messages } })
})

// POST /api/consultations/:id/messages
export const addMessage = asyncHandler(async (req, res) => {
  const { body, channel } = req.body

  const consultation = await Consultation.findById(req.params.id)
  if (!consultation) throw new ApiError(404, 'Consultation not found')

  const isOwner = consultation.userId && consultation.userId.toString() === req.user._id.toString()
  const isAdmin = req.user.roles.includes('admin')
  if (!isOwner && !isAdmin) throw new ApiError(403, 'You do not have permission to reply to this consultation')

  const message = await ConsultationMessage.create({
    consultationId: consultation._id,
    author: isAdmin ? 'admin' : 'customer',
    authorUserId: req.user._id,
    body,
    channel: channel || 'portal',
  })

  // The first admin reply stamps the SLA clock as met.
  if (isAdmin && !consultation.firstResponseAt) {
    consultation.firstResponseAt = new Date()
    if (consultation.status === 'new' || consultation.status === 'assigned') consultation.status = 'in_progress'
    await consultation.save()
  }

  res.status(201).json({ message: 'Message sent', data: message })
})

// GET /api/admin/consultations  (workload inbox)
export const adminList = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  if (req.query.priority) filter.priority = req.query.priority

  const consultations = await Consultation.find(filter)
    .populate('assignedTo', 'name email')
    .sort({ status: 1, priority: -1, createdAt: 1 })
  res.json({ count: consultations.length, data: consultations })
})

// PATCH /api/admin/consultations/:id
export const adminUpdate = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo, resolution } = req.body

  const consultation = await Consultation.findById(req.params.id)
  if (!consultation) throw new ApiError(404, 'Consultation not found')

  const before = { status: consultation.status, priority: consultation.priority }

  if (status) {
    consultation.status = status
    if (status === 'resolved') {
      consultation.resolvedAt = new Date()
      consultation.resolution = resolution || consultation.resolution
    }
  }
  if (priority) consultation.priority = priority
  if (assignedTo !== undefined) consultation.assignedTo = assignedTo || null

  await consultation.save()
  recordAudit(req, { action: 'consultation.update', entity: 'Consultation', entityId: consultation._id, before })

  res.json({ message: 'Consultation updated', data: consultation })
})

// GET /api/admin/consultations/workload
// Counts open consultations per admin, so the team can see who is carrying
// what. This replaces the SQL view the old design used.
export const adminWorkload = asyncHandler(async (req, res) => {
  const rows = await Consultation.aggregate([
    { $match: { status: { $nin: ['resolved', 'closed'] } } },
    {
      $group: {
        _id: '$assignedTo',
        open: { $sum: 1 },
        overdue: {
          $sum: {
            $cond: [{ $lt: ['$responseDueAt', new Date()] }, 1, 0],
          },
        },
      },
    },
    { $sort: { open: -1 } },
  ])

  const data = await Consultation.populate(rows, { path: '_id', select: 'name email' })
  res.json({ count: data.length, data })
})
