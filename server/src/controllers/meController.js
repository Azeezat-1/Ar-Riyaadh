import Booking from '../models/Booking.js'
import Consultation from '../models/Consultation.js'
import Enrollment from '../models/Enrollment.js'
import Notification from '../models/Notification.js'
import Order from '../models/Order.js'
import { publicUser } from './authController.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/me
// The signed-in user's own overview: who they are, what they are enrolled
// in, what they have booked and what they have paid for.
export const overview = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const [enrollments, bookings, consultations, orders, unread] = await Promise.all([
    Enrollment.find({ userId }).populate('classId', 'title category icon accessType deliveryMode').sort({ createdAt: -1 }),
    Booking.find({ userId }).populate('serviceId', 'title category').populate('slotId', 'startsAt endsAt').sort({ createdAt: -1 }),
    Consultation.find({ userId }).sort({ createdAt: -1 }),
    Order.find({ userId }).sort({ createdAt: -1 }),
    Notification.countDocuments({ userId, readAt: null }),
  ])

  res.json({
    data: {
      user: publicUser(req.user),
      stats: {
        enrollments: enrollments.length,
        activeEnrollments: enrollments.filter((e) => e.status === 'active').length,
        bookings: bookings.length,
        consultations: consultations.length,
        orders: orders.length,
        unreadNotifications: unread,
      },
      enrollments,
      bookings,
      consultations,
      orders,
    },
  })
})

// GET /api/me/notifications
export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50)
  res.json({ count: notifications.length, data: notifications })
})

// POST /api/me/notifications/:id/read
export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { readAt: new Date() },
    { new: true }
  )
  res.json({ message: 'Marked as read', data: notification })
})

// POST /api/me/notifications/read-all
export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    { userId: req.user._id, readAt: null },
    { readAt: new Date() }
  )
  res.json({ message: 'All notifications marked as read', data: { updated: result.modifiedCount } })
})
