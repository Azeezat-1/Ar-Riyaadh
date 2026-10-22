import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { rateLimit } from '../utils/security.js'
import { createContactMessage } from '../controllers/contactController.js'

const router = Router()

router.post(
  '/',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: 'Too many messages sent. Please try again later.' }),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').trim().isEmail().withMessage('Please provide a valid email address'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
    body('phone').optional().trim(),
  ],
  validate,
  createContactMessage
)

export default router
