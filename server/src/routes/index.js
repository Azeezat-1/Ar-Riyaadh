import { Router } from 'express'
import classRoutes from './classRoutes.js'
import lectureRoutes from './lectureRoutes.js'
import testimonialRoutes from './testimonialRoutes.js'
import articleRoutes from './articleRoutes.js'
import contactRoutes from './contactRoutes.js'

const router = Router()

router.get('/health', (_req, res) => res.json({ status: 'ok' }))

router.use('/classes', classRoutes)
router.use('/lectures', lectureRoutes)
router.use('/testimonials', testimonialRoutes)
router.use('/homeschooling', articleRoutes)
router.use('/contact', contactRoutes)

export default router