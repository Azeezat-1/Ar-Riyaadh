import { Router } from 'express'
import { body, param } from 'express-validator'
import { getTestimonials, createTestimonial, deleteTestimonial } from '../controllers/testimonialController.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.get('/', getTestimonials)

router.post(
  '/',
  [
    body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
    body('name').optional().trim().isLength({ max: 80 }).withMessage('Name is too long'),
  ],
  validate,
  createTestimonial
)

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid testimonial id')], validate, deleteTestimonial)

export default router