import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { transfer } from '../controllers/enrollmentController.js'

const router = Router()

router.use(requireAuth)

// Admin only: move a student from one class to another.
router.post(
  '/:id/transfer',
  requireRole('admin'),
  [body('toClassId').isMongoId().withMessage('Invalid class id')],
  validate,
  transfer
)

export default router
