import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js'
import { validate } from '../middleware/validate.js'

const router = Router()

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

router.get('/', getArticles)
router.get('/slug/:slug', [param('slug').matches(slugPattern).withMessage('Invalid slug')], validate, getArticleBySlug)

router.post(
  '/',
  [
    body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
    body('slug')
      .trim()
      .matches(slugPattern)
      .withMessage('Slug must be URL-safe (e.g. my-article-title)'),
  ],
  validate,
  createArticle
)

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid article id')], validate, deleteArticle)

export default router