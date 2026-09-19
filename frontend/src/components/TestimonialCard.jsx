import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'

export default function TestimonialCard({ name, category, quote }) {
  return (
    <figure className="card testimonial-card">
      <FontAwesomeIcon icon={icons['quote-left']} className="testimonial-card__quote" aria-hidden="true" />
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