import AuditLog from '../models/AuditLog.js'

// Records an admin mutation. Fire and forget: an audit write must never
// fail the request that triggered it.
export function recordAudit(req, { action, entity, entityId, before = null, after = null }) {
  AuditLog.create({
    actorUserId: req.user?._id || null,
    actorEmail: req.user?.email || '',
    action,
    entity,
    entityId: entityId ? String(entityId) : '',
    before,
    after,
    ip: req.ip || '',
    userAgent: req.get('user-agent') || '',
  }).catch((err) => {
    console.error('[audit] failed to record', action, err.message)
  })
}

// Returns a shallow copy with the fields a client must never be able to set
// removed. Applied to every admin update body.
export function pick(source, fields) {
  const out = {}
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(source, field)) out[field] = source[field]
  }
  return out
}
