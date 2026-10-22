import { Router } from 'express'
import { body, param } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js'

const router = Router()

const validCategories = ['Qurʼān', 'Hadith', 'Tafsir', 'Arabic Language', 'Islamic Studies']

// Public reads.
router.get('/', getClasses)
// No param validation here on purpose: an invalid id must keep returning the
// original 400 "Invalid identifier format" that the existing contract defines.
router.get('/:id', getClassById)

// Writes are admin-only. The public site never creates or edits classes.
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('category').trim().isIn(validCategories).withMessage('Category must be one of: Qurʼān, Hadith, Tafsir, Arabic Language, Islamic Studies'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('priceKobo').optional().isInt({ min: 0 }).withMessage('priceKobo must be a whole number of kobo'),
  ],
  validate,
  createClass
)

router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  [
    param('id').isMongoId().withMessage('Invalid class id'),
    body('title').optional().trim().isLength({ min: 2 }),
    body('category').optional().trim().isIn(validCategories),
    body('priceKobo').optional().isInt({ min: 0 }).withMessage('priceKobo must be a whole number of kobo'),
  ],
  validate,
  updateClass
)

router.delete('/:id', requireAuth, requireRole('admin'), [param('id').isMongoId().withMessage('Invalid class id')], validate, deleteClass)

export default router
