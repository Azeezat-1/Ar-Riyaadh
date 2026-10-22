import mongoose from 'mongoose'

// Append-only audit trail for admin actions. The application never updates
// or deletes these documents.
const auditLogSchema = new mongoose.Schema(
  {
    actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    actorEmail: { type: String, default: '', trim: true },
    action: { type: String, required: [true, 'Action is required'], trim: true },
    entity: { type: String, required: [true, 'Entity is required'], trim: true },
    entityId: { type: String, default: '', trim: true },
    before: { type: mongoose.Schema.Types.Mixed, default: null },
    after: { type: mongoose.Schema.Types.Mixed, default: null },
    ip: { type: String, default: '', trim: true },
    userAgent: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

auditLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 })
auditLogSchema.index({ actorUserId: 1, createdAt: -1 })

export default mongoose.model('AuditLog', auditLogSchema)
