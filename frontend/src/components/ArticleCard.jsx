import { Link } from 'react-router-dom'
import SmartImage from './SmartImage'

export default function ArticleCard({ slug, title, excerpt, category, author, publishedAt, cover }) {
  const href = `/homeschooling/${slug}`
  return (
    <article className="card article-card">
      {cover ? (
        <Link to={href} className="article-card__cover" aria-label={title}>
          <SmartImage src={cover} alt={`Cover for ${title}`} ratio="16 / 9" />
        </Link>
      ) : (
        <Link to={href} className="article-card__cover" aria-label={title}>
          <div className="article-card__cover--placeholder" aria-hidden="true">
            <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice">
              <rect width="400" height="225" fill="#1f3b32" />
              <rect x="40" y="70" width="130" height="6" rx="3" fill="#c9a961" />
              <rect x="40" y="92" width="200" height="6" rx="3" fill="#f4ebdd" opacity="0.8" />
              <rect x="40" y="108" width="170" height="6" rx="3" fill="#f4ebdd" opacity="0.55" />
              <circle cx="330" cy="60" r="70" fill="#2f5547" />
            </svg>
          </div>
        </Link>
      )}
      <div className="article-card__body">
        <div className="article-card__meta">
          {category && <span className="pill">{category}</span>}
          <span className="article-card__date">{publishedAt}</span>
        </div>
        <h3 className="article-card__title">
          <Link to={href}>{title}</Link>
        </h3>
        <p className="article-card__excerpt">{excerpt}</p>
        <span className="article-card__author">By {author}</span>
      </div>
    </article>
  )
}