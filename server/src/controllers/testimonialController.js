import Testimonial from '../models/Testimonial.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 })
  res.json({ count: testimonials.length, data: testimonials })
})

export const createTestimonial = asyncHandler(async (req, res) => {
  // Student-submitted testimonials start un-approved until reviewed.
  const testimonial = await Testimonial.create({ ...req.body, approved: false })
  res.status(201).json({ data: testimonial })
})

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id)
  if (!testimonial) throw new ApiError(404, 'Testimonial not found')
  res.status(204).end()
})