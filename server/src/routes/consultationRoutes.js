import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js'
import { rateLimit } from '../utils/security.js'
import {
  createConsultation,
  listMine,
  getConsultation,
  addMessage,
  adminList,
  adminUpdate,
  adminWorkload,
} from '../controllers/consultationController.js'

const router = Router()

// Public: anyone can ask a question, signed in or not. A signed-in user is
// identified by their token; a guest supplies the guest* fields.
router.post(
  '/',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Too many consultation requests. Please try again later.' }),
  optionalAuth,
  [
    body('subject').trim().isLength({ min: 3 }).withMessage('Subject must be at least 3 characters'),
    body('message').optional().trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
    body('guestName').optional({ values: 'falsy' }).trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('guestEmail').optional({ values: 'falsy' }).isEmail().withMessage('Please provide a valid email address'),
    body('guestPhone').optional({ values: 'falsy' }).trim(),
    body('category').optional({ values: 'falsy' }).trim(),
    body('priority').optional({ values: 'falsy' }).isIn(['low', 'normal', 'high', 'urgent']).withMessage('Priority must be low, normal, high or urgent'),
    body('preferredChannel').optional({ values: 'falsy' }).isIn(['portal', 'email', 'phone', 'whatsapp']).withMessage('Preferred channel is not supported'),
  ],
  validate,
  createConsultation
)

router.use(requireAuth)

// Declared before /:id so these paths are never read as a consultation id.
router.get('/admin/workload', requireRole('admin'), adminWorkload)
router.get('/admin/all', requireRole('admin'), adminList)

router.get('/', listMine)
router.get('/:id', getConsultation)
router.post('/:id/messages', [body('body').trim().isLength({ min: 1 }).withMessage('Message body is required')], validate, addMessage)

router.patch('/admin/:id', requireRole('admin'), adminUpdate)

export default router
