import Class from '../models/Class.js'
import Enrollment from '../models/Enrollment.js'
import EnrollmentTransfer from '../models/EnrollmentTransfer.js'
import Lesson from '../models/Lesson.js'
import ClassSession from '../models/ClassSession.js'
import { ApiError } from '../utils/ApiError.js'
import { recordAudit } from '../middleware/audit.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/enrollments  (the signed-in student's enrolments)
export const listMine = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ userId: req.user._id })
    .populate('classId', 'title category icon accessType deliveryMode telegramChannel')
    .sort({ createdAt: -1 })
  res.json({ count: enrollments.length, data: enrollments })
})

// GET /api/enrollments/:id
export const getOne = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id)
    .populate('classId', 'title category icon description focus accessType deliveryMode telegramChannel')
  if (!enrollment) throw new ApiError(404, 'Enrollment not found')
  if (enrollment.userId.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
    throw new ApiError(403, 'You do not have permission to view this enrollment')
  }
  res.json({ data: enrollment })
})

// POST /api/enrollments  (join a free class, or enrol after payment)
export const enroll = asyncHandler(async (req, res) => {
  const { classId } = req.body

  const item = await Class.findById(classId)
  if (!item) throw new ApiError(404, 'Class not found')
  if (!item.active) throw new ApiError(400, 'This class is not currently open for enrolment')

  const existing = await Enrollment.findOne({ userId: req.user._id, classId })
  if (existing && ['active', 'pending'].includes(existing.status)) {
    throw new ApiError(409, 'You are already enrolled in this class')
  }

  // A paid class cannot be joined directly; an order must be paid first.
  if (item.accessType === 'paid' && item.priceKobo > 0) {
    throw new ApiError(402, 'This class requires payment. Create an order and complete payment first.')
  }

  const enrollment = await Enrollment.create({
    userId: req.user._id,
    classId,
    status: 'active',
    accessType: item.accessType === 'paid' ? 'paid' : item.accessType,
    startedAt: new Date(),
  })

  res.status(201).json({ message: 'Enrolled', data: enrollment })
})

// PATCH /api/enrollments/:id/progress  (mark a lesson complete)
export const updateProgress = asyncHandler(async (req, res) => {
  const { lessonId, completed } = req.body

  const enrollment = await Enrollment.findById(req.params.id)
  if (!enrollment) throw new ApiError(404, 'Enrollment not found')
  if (enrollment.userId.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
    throw new ApiError(403, 'You do not have permission to update this enrollment')
  }

  const total = await Lesson.countDocuments({ classId: enrollment.classId, isPublished: true })
  const map = enrollment.completedLessons || new Map()
  map.set(String(lessonId), completed !== false)

  const lessonsCompleted = Array.from(map.values()).filter(Boolean).length
  const progressPercent = total > 0 ? Math.min(100, Math.round((lessonsCompleted / total) * 100)) : 0

  enrollment.completedLessons = map
  enrollment.lessonsCompleted = lessonsCompleted
  enrollment.progressPercent = progressPercent
  enrollment.lastAccessedAt = new Date()
  if (progressPercent >= 100 && enrollment.status === 'active') {
    enrollment.status = 'completed'
    enrollment.completedAt = new Date()
  }
  await enrollment.save()

  res.json({ message: 'Progress updated', data: enrollment })
})

// GET /api/enrollments/:id/lessons
export const listLessons = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id)
  if (!enrollment) throw new ApiError(404, 'Enrollment not found')
  if (enrollment.userId.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
    throw new ApiError(403, 'You do not have permission to view this enrollment')
  }

  const lessons = await Lesson.find({ classId: enrollment.classId, isPublished: true }).sort({ order: 1 })
  const completed = enrollment.completedLessons || new Map()
  const data = lessons.map((lesson) => ({
    ...lesson.toObject(),
    completed: completed.get(String(lesson._id)) === true,
  }))

  res.json({ count: data.length, data })
})

// GET /api/enrollments/:id/sessions
export const listSessions = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id)
  if (!enrollment) throw new ApiError(404, 'Enrollment not found')
  if (enrollment.userId.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
    throw new ApiError(403, 'You do not have permission to view this enrollment')
  }
  const sessions = await ClassSession.find({ classId: enrollment.classId }).sort({ startsAt: 1 })
  res.json({ count: sessions.length, data: sessions })
})

// POST /api/admin/enrollments/:id/transfer  (admin only)
// Moves a student from one class to another: the old enrolment is cancelled
// and a new one is created, and the move is recorded.
export const transfer = asyncHandler(async (req, res) => {
  const { toClassId, reason } = req.body

  const enrollment = await Enrollment.findById(req.params.id)
  if (!enrollment) throw new ApiError(404, 'Enrollment not found')

  const target = await Class.findById(toClassId)
  if (!target) throw new ApiError(404, 'Target class not found')
  if (target._id.toString() === enrollment.classId.toString()) {
    throw new ApiError(400, 'The student is already enrolled in that class')
  }

  const clash = await Enrollment.findOne({ userId: enrollment.userId, classId: toClassId })
  if (clash && ['active', 'pending'].includes(clash.status)) {
    throw new ApiError(409, 'The student already has an active enrollment in that class')
  }

  enrollment.status = 'cancelled'
  enrollment.cancelledAt = new Date()
  enrollment.notes = reason || enrollment.notes
  await enrollment.save()

  const created = await Enrollment.create({
    userId: enrollment.userId,
    classId: toClassId,
    status: 'active',
    accessType: target.accessType,
    startedAt: new Date(),
    createdBy: req.user._id,
  })

  await EnrollmentTransfer.create({
    userId: enrollment.userId,
    fromEnrollmentId: enrollment._id,
    fromClassId: enrollment.classId,
    toEnrollmentId: created._id,
    toClassId,
    reason: reason || '',
    movedBy: req.user._id,
  })

  recordAudit(req, { action: 'enrollment.transfer', entity: 'Enrollment', entityId: enrollment._id })

  res.json({ message: 'Student transferred', data: created })
})
