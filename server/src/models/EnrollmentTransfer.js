import mongoose from 'mongoose'

// Audit trail of a student moving from one class to another. The old
// enrolment is cancelled and a new one is created; this record explains why.
const enrollmentTransferSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromEnrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', default: null },
    fromClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
    toEnrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', default: null },
    toClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    reason: { type: String, default: '', trim: true },
    movedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

enrollmentTransferSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model('EnrollmentTransfer', enrollmentTransferSchema)
