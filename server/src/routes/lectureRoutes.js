import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getLectures,
  getLectureById,
  createLecture,
  updateLecture,
  deleteLecture,
} from '../controllers/lectureController.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.get('/', getLectures)
router.get('/:id', [param('id').isMongoId().withMessage('Invalid lecture id')], validate, getLectureById)

router.post(
  '/',
  [
    body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('status').optional().isIn(['Ongoing', 'Upcoming', 'Completed']).withMessage('Invalid status'),
  ],
  validate,
  createLecture
)

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid lecture id'),
    body('status').optional().isIn(['Ongoing', 'Upcoming', 'Completed']),
  ],
  validate,
  updateLecture
)

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid lecture id')], validate, deleteLecture)

export default router