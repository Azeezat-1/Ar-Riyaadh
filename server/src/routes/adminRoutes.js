import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  dashboard,
  listUsers,
  updateUser,
  listClasses,
  updateClass,
  listEnrollments,
  listOrders,
  listAuditLogs,
} from '../controllers/adminController.js'

const router = Router()

// Every route under /api/admin requires an admin account.
router.use(requireAuth, requireRole('admin'))

router.get('/dashboard', dashboard)

router.get('/users', listUsers)
router.patch(
  '/users/:id',
  [
    body('roles')
      .optional()
      .isArray()
      .withMessage('roles must be an array')
      .custom((roles) => roles.every((role) => ['student', 'customer', 'admin'].includes(role)))
      .withMessage('roles may only contain student, customer or admin'),
    body('status').optional().isIn(['active', 'suspended', 'pending']).withMessage('Invalid status'),
  ],
  validate,
  updateUser
)

router.get('/classes', listClasses)
router.put('/classes/:id', updateClass)

router.get('/enrollments', listEnrollments)
router.get('/orders', listOrders)
router.get('/audit-logs', listAuditLogs)

export default router
