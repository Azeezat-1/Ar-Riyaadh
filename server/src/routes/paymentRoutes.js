import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  initialize,
  webhook,
  verify,
  createOrder,
  createRefund,
} from '../controllers/paymentController.js'

const router = Router()

// The webhook is called by Paystack, not by a signed-in user, so it must not
// require auth. It authenticates with the request signature instead.
router.post('/webhook', webhook)

// Everything else needs a signed-in user.
router.use(requireAuth)

router.post(
  '/initialize',
  [body('orderReference').notEmpty().withMessage('orderReference is required')],
  validate,
  initialize
)

router.post('/verify', [body('reference').notEmpty().withMessage('reference is required')], validate, verify)

router.post(
  '/orders',
  [body('orderType').isIn(['course_enrollment', 'service_booking', 'consultation']).withMessage('Invalid orderType')],
  validate,
  createOrder
)

router.post(
  '/refunds',
  requireRole('admin'),
  [
    body('orderId').isMongoId().withMessage('Invalid order id'),
    body('amountKobo').isInt({ min: 1 }).withMessage('amountKobo must be a positive integer'),
  ],
  validate,
  createRefund
)

export default router
