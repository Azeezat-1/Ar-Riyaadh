import { Router } from 'express'
import { body, param } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  getLectures,
  getLectureById,
  createLecture,
  updateLecture,
  deleteLecture,
} from '../controllers/lectureController.js'

const router = Router()

// Public reads.
router.get('/', getLectures)
// See classRoutes.js: an invalid id keeps the original 400 contract.
router.get('/:id', getLectureById)

// Writes are admin-only.
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('status').optional().isIn(['Ongoing', 'Upcoming', 'Completed']).withMessage('Invalid status'),
  ],
  validate,
  createLecture
)

router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  [
    param('id').isMongoId().withMessage('Invalid lecture id'),
    body('status').optional().isIn(['Ongoing', 'Upcoming', 'Completed']).withMessage('Invalid status'),
  ],
  validate,
  updateLecture
)

router.delete('/:id', requireAuth, requireRole('admin'), [param('id').isMongoId().withMessage('Invalid lecture id')], validate, deleteLecture)

export default router
