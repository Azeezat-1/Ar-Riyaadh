import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  createBooking,
  listMine,
  getBooking,
  cancelBooking,
  updateBookingStatus,
  reviewHealthForm,
} from '../controllers/bookingController.js'

const router = Router()

router.use(requireAuth)

// Mine is declared before /:id so it is never treated as a booking id.
router.get('/mine', listMine)
router.post('/', createBooking)
router.get('/:id', getBooking)
router.post('/:id/cancel', [body('reason').optional().trim()], validate, cancelBooking)

// --- Admin ------------------------------------------------------------------
router.patch(
  '/admin/:id/status',
  requireRole('admin'),
  [body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']).withMessage('Invalid status')],
  validate,
  updateBookingStatus
)

router.post(
  '/admin/:id/health-review',
  requireRole('admin'),
  [body('cleared').isBoolean().withMessage('cleared must be a boolean')],
  validate,
  reviewHealthForm
)

export default router
