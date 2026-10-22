import mongoose from 'mongoose'

// A consultation request. Can be raised by a signed-in user or by a guest,
// so userId is optional and the guest contact details are captured directly.
const consultationSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestName: { type: String, default: '', trim: true },
    guestEmail: { type: String, default: '', trim: true, lowercase: true },
    guestPhone: { type: String, default: '', trim: true },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    category: { type: String, default: 'general', trim: true },
    priority: {
      type: String,
      enum: { values: ['low', 'normal', 'high', 'urgent'], message: 'Priority must be low, normal, high or urgent' },
      default: 'normal',
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'assigned', 'in_progress', 'awaiting_customer', 'resolved', 'closed'],
        message: 'Status must be new, assigned, in_progress, awaiting_customer, resolved or closed',
      },
      default: 'new',
    },
    preferredChannel: {
      type: String,
      enum: { values: ['whatsapp', 'phone', 'email', 'portal'], message: 'Invalid preferredChannel' },
      default: 'portal',
    },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    // Paid consultations are bookable; free advice stays at 0.
    priceKobo: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'NGN', uppercase: true, trim: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    responseDueAt: { type: Date, default: null },
    firstResponseAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
    resolution: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

consultationSchema.index({ reference: 1 }, { unique: true })
consultationSchema.index({ userId: 1, createdAt: -1 })
consultationSchema.index({ status: 1, priority: 1, createdAt: -1 })
consultationSchema.index({ assignedTo: 1, status: 1 })

export default mongoose.model('Consultation', consultationSchema)
