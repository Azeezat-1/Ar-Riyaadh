import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import SmartImage from './SmartImage'

export default function BookCard({ title, description, category, cover, link }) {
  return (
    <article className="card book-card">
      <div className="book-card__cover">
        {cover ? (
          <SmartImage src={cover} alt={`Cover of the book ${title}`} ratio="3 / 4" />
        ) : (
          <div className="book-card__cover--generic" role="img" aria-label={`Book: ${title}`}>
            <svg viewBox="0 0 200 260" aria-hidden="true">
              <rect width="200" height="260" rx="10" fill="#1f3b32" />
              <rect x="16" y="16" width="168" height="228" rx="6" fill="none" stroke="#c9a961" strokeWidth="2" opacity="0.5" />
              <text x="100" y="120" textAnchor="middle" fill="#f4ebdd" fontSize="13" fontFamily="Fraunces, serif" letterSpacing="1">
                {title.length > 30 ? title.slice(0, 27) + '…' : title}
              </text>
              {category && (
                <text x="100" y="150" textAnchor="middle" fill="#c9a961" fontSize="9" fontFamily="Inter, sans-serif" letterSpacing="1.5">
                  {category}
                </text>
              )}
            </svg>
          </div>
        )}
      </div>
      <div className="book-card__body">
        <h3 className="book-card__title">{title}</h3>
        {category && <span className="pill">{category}</span>}
        {description && <p className="book-card__desc">{description}</p>}
        {link && link !== '#' && (
          <a href={link} className="btn btn--outline btn--sm" rel="noreferrer" target="_blank">
            <FontAwesomeIcon icon={icons['book-open']} />
            View Book
          </a>
        )}
      </div>
    </article>
  )
}