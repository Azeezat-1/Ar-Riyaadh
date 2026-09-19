import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js'
import { validate } from '../middleware/validate.js'

const router = Router()

const validCategories = ['Qur\u02bc\u0101n', 'Hadith', 'Tafsir', 'Arabic Language', 'Islamic Studies']

router.get('/', getClasses)
router.get('/:id', validate, getClassById)

router.post(
  '/',
  [
    body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('category')
      .trim()
      .isIn(validCategories)
      .withMessage('Category must be one of: Qur\u02bc\u0101n, Hadith, Tafsir, Arabic Language, Islamic Studies'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  ],
  validate,
  createClass
)

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid class id'),
    body('title').optional().trim().isLength({ min: 2 }),
    body('category').optional().trim().isIn(validCategories),
  ],
  validate,
  updateClass
)

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid class id')], validate, deleteClass)

export default router