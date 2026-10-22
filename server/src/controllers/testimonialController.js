import Testimonial from '../models/Testimonial.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ approved: true }).sort({ displayOrder: 1, createdAt: -1 })
  res.json({ count: testimonials.length, data: testimonials })
})

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create({
    ...req.body,
    // Student submissions are never published automatically; an admin has to
    // approve each one before it appears on the public site.
    approved: false,
    // Link to the account when the visitor is signed in.
    userId: req.user?._id || null,
  })
  res.status(201).json({ message: 'Thank you. Your testimonial will appear once it has been reviewed.', data: testimonial })
})

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id)
  if (!testimonial) throw new ApiError(404, 'Testimonial not found')
  res.status(204).end()
})
