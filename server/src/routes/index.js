import { Router } from 'express'
import classRoutes from './classRoutes.js'
import lectureRoutes from './lectureRoutes.js'
import testimonialRoutes from './testimonialRoutes.js'
import articleRoutes from './articleRoutes.js'
import contactRoutes from './contactRoutes.js'
import authRoutes from './authRoutes.js'
import enrollmentRoutes from './enrollmentRoutes.js'
import serviceRoutes from './serviceRoutes.js'
import bookingRoutes from './bookingRoutes.js'
import consultationRoutes from './consultationRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import meRoutes from './meRoutes.js'
import adminRoutes from './adminRoutes.js'
import adminEnrollmentRoutes from './adminEnrollmentRoutes.js'

const router = Router()

router.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Public content routes (unchanged from the original contract).
router.use('/classes', classRoutes)
router.use('/lectures', lectureRoutes)
router.use('/testimonials', testimonialRoutes)
router.use('/homeschooling', articleRoutes)
router.use('/contact', contactRoutes)

// Account and commerce routes.
router.use('/auth', authRoutes)
router.use('/enrollments', enrollmentRoutes)
router.use('/services', serviceRoutes)
router.use('/bookings', bookingRoutes)
router.use('/consultations', consultationRoutes)
router.use('/payments', paymentRoutes)
router.use('/me', meRoutes)

// Admin area.
router.use('/admin/enrollments', adminEnrollmentRoutes)
router.use('/admin', adminRoutes)

export default router
