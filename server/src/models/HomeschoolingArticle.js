import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Article title is required'], trim: true },
    slug: {
      type: String,
      required: [true, 'Article slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe (e.g. my-article-title)'],
    },
    excerpt: { type: String, default: '', trim: true },
    content: { type: String, default: '', trim: true },
    image: { type: String, default: '', trim: true },
    author: { type: String, default: 'Umu Abdullah Riyadh', trim: true },
    category: { type: String, default: 'Reflections', trim: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
)

articleSchema.pre('save', function preSave(next) {
  if (!this.publishedAt) this.publishedAt = new Date()
  next()
})

export default mongoose.model('HomeschoolingArticle', articleSchema)