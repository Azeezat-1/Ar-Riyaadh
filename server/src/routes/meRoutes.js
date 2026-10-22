import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  overview,
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/meController.js'

const router = Router()

router.use(requireAuth)

router.get('/', overview)
router.get('/notifications', listNotifications)
router.post('/notifications/read-all', markAllNotificationsRead)
router.post('/notifications/:id/read', markNotificationRead)

export default router
