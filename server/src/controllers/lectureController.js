import Lecture from '../models/Lecture.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getLectures = asyncHandler(async (req, res) => {
  const { topic, status } = req.query
  const filter = {}
  if (topic) filter.topic = topic
  if (status) filter.status = status
  const lectures = await Lecture.find(filter).sort({ createdAt: -1 })
  res.json({ count: lectures.length, data: lectures })
})

export const getLectureById = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id)
  if (!lecture) throw new ApiError(404, 'Lecture not found')
  res.json({ data: lecture })
})

export const createLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.create(req.body)
  res.status(201).json({ data: lecture })
})

export const updateLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!lecture) throw new ApiError(404, 'Lecture not found')
  res.json({ data: lecture })
})

export const deleteLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findByIdAndDelete(req.params.id)
  if (!lecture) throw new ApiError(404, 'Lecture not found')
  res.status(204).end()
})