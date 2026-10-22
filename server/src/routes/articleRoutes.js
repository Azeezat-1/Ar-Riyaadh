import { Router } from 'express'
import { body, param } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js'

const router = Router()

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Public reads.
router.get('/', getArticles)
router.get('/slug/:slug', [param('slug').matches(slugPattern).withMessage('Invalid slug')], validate, getArticleBySlug)

// Writes are admin-only.
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('slug').trim().matches(slugPattern).withMessage('Slug must be URL-safe (e.g. my-article-title)'),
  ],
  validate,
  createArticle
)

router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  [param('id').isMongoId().withMessage('Invalid article id')],
  validate,
  updateArticle
)

router.delete('/:id', requireAuth, requireRole('admin'), [param('id').isMongoId().withMessage('Invalid article id')], validate, deleteArticle)

export default router
