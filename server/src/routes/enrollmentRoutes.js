import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import {
  listMine,
  getOne,
  enroll,
  updateProgress,
  listLessons,
  listSessions,
} from '../controllers/enrollmentController.js'

const router = Router()

router.use(requireAuth)

router.get('/', listMine)
router.post('/', [body('classId').isMongoId().withMessage('Invalid class id')], validate, enroll)
router.get('/:id', getOne)
router.get('/:id/lessons', listLessons)
router.get('/:id/sessions', listSessions)
router.patch(
  '/:id/progress',
  [body('lessonId').isMongoId().withMessage('Invalid lesson id')],
  validate,
  updateProgress
)

// The admin transfer endpoint lives on its own router, mounted at
// /api/admin/enrollments, so it can never be reached by a student.

export default router
