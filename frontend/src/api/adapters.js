// Maps backend documents to the exact prop shapes the card components expect,
// so the frontend can consume API data without touching component code.

export function classFromApi(c) {
  return { ...c, id: c._id || c.id }
}

export function lectureFromApi(l) {
  return {
    id: l._id || l.id,
    topic: l.topic,
    title: l.title,
    excerpt: l.description,
    tags: l.tags,
    schedule: l.schedule,
    audience: l.audience,
    status: l.status,
    accessLink: l.accessLink,
  }
}

export function testimonialFromApi(t) {
  return {
    id: t._id || t.id,
    name: t.name,
    category: t.category,
    quote: t.content,
  }
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function articleFromApi(a) {
  return {
    id: a._id || a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    author: a.author,
    publishedAt: formatDate(a.publishedAt) || a.publishedAt,
    cover: a.image || '',
  }
}

export function articleDetailFromApi(a) {
  return { ...articleFromApi(a), content: a.content || '' }
}