import Booking from '../models/Booking.js'
import Class from '../models/Class.js'
import Consultation from '../models/Consultation.js'
import Enrollment from '../models/Enrollment.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { recordAudit } from '../middleware/audit.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/admin/dashboard
// One request that returns everything the admin overview needs. Aggregating
// in the database keeps it to a single round trip instead of eight.
export const dashboard = asyncHandler(async (req, res) => {
  const now = new Date()
  const startOfMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    newUsers,
    totalEnrollments,
    activeEnrollments,
    totalBookings,
    openConsultations,
    revenueRows,
    recentOrders,
    pendingPayments,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Enrollment.countDocuments({}),
    Enrollment.countDocuments({ status: 'active' }),
    Booking.countDocuments({}),
    Consultation.countDocuments({ status: { $nin: ['resolved', 'closed'] } }),
    Order.aggregate([
      { $match: { status: 'paid', paidAt: { $gte: startOfMonth } } },
      { $group: { _id: '$paidAt', revenueKobo: { $sum: '$totalKobo' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Order.find({}).sort({ createdAt: -1 }).limit(10).populate('userId', 'name email'),
    Order.countDocuments({ status: 'pending' }),
  ])

  const revenueKobo = revenueRows.reduce((sum, row) => sum + row.revenueKobo, 0)

  res.json({
    data: {
      users: { total: totalUsers, newLast30Days: newUsers },
      enrollments: { total: totalEnrollments, active: activeEnrollments },
      bookings: { total: totalBookings },
      consultations: { open: openConsultations },
      revenue: {
        last30DaysKobo: revenueKobo,
        currency: 'NGN',
        byDay: revenueRows.map((row) => ({ date: row._id, revenueKobo: row.revenueKobo, orders: row.orders })),
      },
      orders: { pending: pendingPayments },
      recentOrders,
    },
  })
})

// GET /api/admin/users
export const listUsers = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.role) filter.roles = req.query.role
  if (req.query.status) filter.status = req.query.status
  if (req.query.search) {
    const safe = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    filter.$or = [{ email: new RegExp(safe, 'i') }, { name: new RegExp(safe, 'i') }]
  }

  const limit = Math.min(Number(req.query.limit) || 50, 200)
  const page = Math.max(Number(req.query.page) || 1, 1)

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ])

  res.json({ count: users.length, total, page, limit, data: users })
})

// PATCH /api/admin/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const { name, phone, roles, status } = req.body

  const update = {}
  if (name !== undefined) update.name = name
  if (phone !== undefined) update.phone = phone
  if (roles !== undefined) {
    const safe = (roles || []).filter((role) => ['student', 'customer', 'admin'].includes(role))
    update.roles = safe.length ? safe : ['student']
  }
  if (status !== undefined) update.status = status

  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
  if (!user) throw new ApiError(404, 'User not found')

  recordAudit(req, { action: 'user.update', entity: 'User', entityId: user._id, after: update })
  res.json({ message: 'User updated', data: user })
})

// GET /api/admin/classes  (list every class including inactive ones)
export const listClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find().sort({ displayOrder: 1, createdAt: -1 })
  res.json({ count: classes.length, data: classes })
})

// PUT /api/admin/classes/:id
export const updateClass = asyncHandler(async (req, res) => {
  const before = await Class.findById(req.params.id).lean()
  const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!cls) throw new ApiError(404, 'Class not found')
  recordAudit(req, { action: 'class.update', entity: 'Class', entityId: cls._id, before, after: cls.toObject() })
  res.json({ message: 'Class updated', data: cls })
})

// GET /api/admin/enrollments
export const listEnrollments = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.classId) filter.classId = req.query.classId
  if (req.query.status) filter.status = req.query.status

  const enrollments = await Enrollment.find(filter)
    .populate('userId', 'name email')
    .populate('classId', 'title category')
    .sort({ createdAt: -1 })
  res.json({ count: enrollments.length, data: enrollments })
})

// GET /api/admin/orders
export const listOrders = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.status) filter.status = req.query.status

  const orders = await Order.find(filter)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
  res.json({ count: orders.length, data: orders })
})

// GET /api/admin/audit-logs
export const listAuditLogs = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.entity) filter.entity = req.query.entity
  if (req.query.entityId) filter.entityId = req.query.entityId

  const logs = await (await import('../models/AuditLog.js')).default
    .find(filter)
    .populate('actorUserId', 'name email')
    .sort({ createdAt: -1 })
    .limit(200)
  res.json({ count: logs.length, data: logs })
})
