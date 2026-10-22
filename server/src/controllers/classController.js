import Class from '../models/Class.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

// Builds a URL-safe slug from a title.
function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const getClasses = asyncHandler(async (req, res) => {
  const { active, category } = req.query
  const filter = { active: active === 'false' ? false : true }
  if (category && category !== 'all') filter.category = category

  const classes = await Class.find(filter).sort({ displayOrder: 1, createdAt: 1 })
  res.json({ count: classes.length, data: classes })
})

export const getClassById = asyncHandler(async (req, res) => {
  const cls = await Class.findById(req.params.id)
  if (!cls) throw new ApiError(404, 'Class not found')
  res.json({ data: cls })
})

export const createClass = asyncHandler(async (req, res) => {
  const body = { ...req.body }
  if (!body.slug && body.title) body.slug = slugify(body.title)

  const cls = await Class.create(body)
  res.status(201).json({ message: 'Class created', data: cls })
})

export const updateClass = asyncHandler(async (req, res) => {
  const body = { ...req.body }
  if (body.title && !body.slug) body.slug = slugify(body.title)

  const cls = await Class.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
  if (!cls) throw new ApiError(404, 'Class not found')
  res.json({ message: 'Class updated', data: cls })
})

export const deleteClass = asyncHandler(async (req, res) => {
  const cls = await Class.findByIdAndDelete(req.params.id)
  if (!cls) throw new ApiError(404, 'Class not found')
  res.status(204).end()
})
