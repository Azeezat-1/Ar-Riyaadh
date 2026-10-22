import mongoose from 'mongoose'

const classSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Class title is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Class category is required'],
      enum: {
        values: ['Qurʼān', 'Hadith', 'Tafsir', 'Arabic Language', 'Islamic Studies'],
        message: 'Category must be Qurʼān, Hadith, Tafsir, Arabic Language or Islamic Studies',
      },
      trim: true,
    },
    icon: { type: String, default: 'book-open', trim: true },
    description: { type: String, required: [true, 'Class description is required'], trim: true },
    audience: { type: String, trim: true },
    focus: { type: [String], default: [] },
    schedule: { type: String, default: 'Live and self-paced options available.', trim: true },
    link: { type: String, default: 'https://t.me/ArRiyadhAcademy', trim: true },
    active: { type: Boolean, default: true },

    // --- Catalogue identity -------------------------------------------------
    slug: { type: String, trim: true, lowercase: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },

    // --- Enrolment and delivery ---------------------------------------------
    // accessType and deliveryMode are independent axes: a class can be live and
    // free, live and paid, recorded and free, or recorded and paid.
    accessType: {
      type: String,
      enum: { values: ['free', 'paid', 'complimentary'], message: 'accessType must be free, paid or complimentary' },
      default: 'free',
    },
    deliveryMode: {
      type: String,
      enum: { values: ['live', 'recorded', 'hybrid'], message: 'deliveryMode must be live, recorded or hybrid' },
      default: 'live',
    },
    // Money is stored in kobo (integer) to avoid floating point drift.
    priceKobo: { type: Number, default: 0, min: [0, 'priceKobo cannot be negative'] },
    currency: { type: String, default: 'NGN', uppercase: true, trim: true },
    capacity: { type: Number, default: 0, min: [0, 'capacity cannot be negative'] },
    durationWeeks: { type: Number, default: 0, min: 0 },
    startDate: { type: Date, default: null },
    enrollmentDeadline: { type: Date, default: null },
    telegramChannel: { type: String, default: '', trim: true },
  },
  { timestamps: true }
)

classSchema.index({ slug: 1 }, { unique: true, sparse: true })
classSchema.index({ active: 1, displayOrder: 1 })
classSchema.index({ category: 1, active: 1 })

export default mongoose.model('Class', classSchema)
