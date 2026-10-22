import mongoose from 'mongoose'

// Outbox for email and WhatsApp messages. A worker drains the queue, so a
// slow mail server can never delay a payment webhook response.
const outboxMessageSchema = new mongoose.Schema(
  {
    channel: {
      type: String,
      enum: { values: ['email', 'whatsapp', 'sms'], message: 'Channel must be email, whatsapp or sms' },
      required: true,
    },
    template: { type: String, required: [true, 'Template is required'], trim: true },
    to: { type: String, required: [true, 'Recipient is required'], trim: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: { values: ['queued', 'sent', 'failed'], message: 'Status must be queued, sent or failed' },
      default: 'queued',
    },
    attempts: { type: Number, default: 0, min: 0 },
    lastError: { type: String, default: '', trim: true },
    scheduledFor: { type: Date, default: Date.now },
    sentAt: { type: Date, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

outboxMessageSchema.index({ status: 1, scheduledFor: 1 })

export default mongoose.model('OutboxMessage', outboxMessageSchema)
