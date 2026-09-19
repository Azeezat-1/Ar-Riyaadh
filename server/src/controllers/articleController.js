import Article from '../models/HomeschoolingArticle.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find({})
    .sort({ publishedAt: -1 })
    .select('-content') // list views don't need the full body
  res.json({ count: articles.length, data: articles })
})

export const getArticleBySlug = asyncHandler(async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (!article) throw new ApiError(404, 'Article not found')
  res.json({ data: article })
})

export const createArticle = asyncHandler(async (req, res) => {
  const article = await Article.create(req.body)
  res.status(201).json({ data: article })
})

export const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!article) throw new ApiError(404, 'Article not found')
  res.json({ data: article })
})

export const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.id)
  if (!article) throw new ApiError(404, 'Article not found')
  res.status(204).end()
})