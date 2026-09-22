import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'

export default function TestimonialCard({ name, category, quote, rating = 5 }) {
  return (
    <figure className="card testimonial-card">
      <FontAwesomeIcon icon={icons['quote-left']} className="testimonial-card__quote" aria-hidden="true" />
      <div className="testimonial-card__stars" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={icons.star}
            className={i < rating ? 'testimonial-card__star is-filled' : 'testimonial-card__star'}
            aria-hidden="true"
          />
        ))}
      </div>
      <blockquote>
        <p>{quote}</p>
      </blockquote>
      <figcaption>
        <span className="avatar" aria-hidden="true">
          {name.charAt(0)}
        </span>
        <span className="testimonial-card__who">
          <span className="testimonial-card__name">{name}</span>
          <span className="testimonial-card__category">{category}</span>
        </span>
      </figcaption>
    </figure>
  )
}