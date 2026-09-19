import Class from '../models/Class.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getClasses = asyncHandler(async (req, res) => {
  const { category, active } = req.query
  const filter = { active: active === 'false' ? false : true }
  if (category && category !== 'all') filter.category = category
  const classes = await Class.find(filter).sort({ createdAt: 1 })
  res.json({ count: classes.length, data: classes })
})

export const getClassById = asyncHandler(async (req, res) => {
  const cls = await Class.findById(req.params.id)
  if (!cls) throw new ApiError(404, 'Class not found')
  res.json({ data: cls })
})

export const createClass = asyncHandler(async (req, res) => {
  const cls = await Class.create(req.body)
  res.status(201).json({ data: cls })
})

export const updateClass = asyncHandler(async (req, res) => {
  const cls = await Class.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!cls) throw new ApiError(404, 'Class not found')
  res.json({ data: cls })
})

export const deleteClass = asyncHandler(async (req, res) => {
  const cls = await Class.findByIdAndDelete(req.params.id)
  if (!cls) throw new ApiError(404, 'Class not found')
  res.status(204).end()
})