import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { rateLimit } from '../utils/security.js'
import {
  register,
  login,
  refresh,
  logout,
  me,
  updateMe,
  changePassword,
  adminCreateUser,
} from '../controllers/authController.js'

const router = Router()

// Brute-force protection on the credential endpoints.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many attempts. Please try again in a few minutes.' })

router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phone').optional().trim(),
  ],
  validate,
  register
)

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(), body('password').notEmpty().withMessage('Password is required')],
  validate,
  login
)

router.post('/refresh', [body('refreshToken').notEmpty().withMessage('refreshToken is required')], validate, refresh)
router.post('/logout', logout)

router.get('/me', requireAuth, me)
router.patch(
  '/me',
  requireAuth,
  [body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters')],
  validate,
  updateMe
)
router.post(
  '/change-password',
  requireAuth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ],
  validate,
  changePassword
)

// Admin only.
router.post(
  '/admin/users',
  requireAuth,
  requireRole('admin'),
  [
    body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  ],
  validate,
  adminCreateUser
)

export default router
