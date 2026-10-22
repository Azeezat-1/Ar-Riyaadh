import { Router } from 'express'
import { body, param } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js'
import { rateLimit } from '../utils/security.js'
import {
  getTestimonials,
  createTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js'

const router = Router()

// Public reads.
router.get('/', getTestimonials)

// A visitor may send a testimonial from the public site; it stays unapproved
// until an admin reviews it. Signed-in students are linked to their account.
router.post(
  '/',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: 'Too many testimonials submitted. Please try again later.' }),
  optionalAuth,
  [
    body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
    body('name').optional().trim().isLength({ max: 80 }).withMessage('Name is too long'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  ],
  validate,
  createTestimonial
)

router.delete('/:id', requireAuth, requireRole('admin'), [param('id').isMongoId().withMessage('Invalid testimonial id')], validate, deleteTestimonial)

export default router
