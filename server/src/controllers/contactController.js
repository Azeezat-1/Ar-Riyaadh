import ContactMessage from '../models/ContactMessage.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body)
  // NOTE: In production, send a notification here (e.g. email/Telegram).
  res.status(201).json({
    message: 'Message received. The academy will get back to you soon, in shā\u2019 Allāh.',
    data: message,
  })
})