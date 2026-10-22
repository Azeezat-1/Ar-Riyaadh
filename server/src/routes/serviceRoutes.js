import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  listServices,
  getService,
  listSlots,
  adminListServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
  adminCreateSlot,
} from '../controllers/bookingController.js'

const router = Router()

// --- Admin ------------------------------------------------------------------
// Declared BEFORE the public /:id routes. Express matches in registration
// order, so keeping the literal admin paths first means a future
// GET /:id/something can never swallow GET /admin/list.
router.get('/admin/list', requireAuth, requireRole('admin'), adminListServices)
router.post('/admin', requireAuth, requireRole('admin'), adminCreateService)
router.put('/admin/:id', requireAuth, requireRole('admin'), adminUpdateService)
router.delete('/admin/:id', requireAuth, requireRole('admin'), adminDeleteService)
router.post(
  '/admin/:id/slots',
  requireAuth,
  requireRole('admin'),
  [body('startsAt').isISO8601().withMessage('startsAt must be a valid date')],
  validate,
  adminCreateSlot
)

// --- Public catalogue -------------------------------------------------------
router.get('/', listServices)
router.get('/:id', getService)
router.get('/:id/slots', listSlots)

export default router
