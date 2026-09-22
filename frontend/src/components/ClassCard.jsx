import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { WA_BASE } from '../data/content'

export default function ClassCard({ icon, category, title, description, focus, link }) {
  const enrollTo = link || WA_BASE
  return (
    <article className="card class-card">
      <span className="pill">{category}</span>
      <div className="icon-wrap icon-wrap--gold">
        <FontAwesomeIcon icon={icons[icon]} aria-hidden="true" />
      </div>
      <h3 className="class-card__title">{title}</h3>
      <p className="class-card__desc">{description}</p>
      {focus && (
        <ul className="class-card__focus">
          {focus.map((f) => (
            <li key={f}>
              <FontAwesomeIcon icon={icons.check} aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      )}
      <a
        href={enrollTo}
        className="btn btn--primary btn--sm class-card__cta"
        rel="noreferrer"
        target="_blank"
      >
        <FontAwesomeIcon icon={icons.brandWhatsapp} />
        Enroll via WhatsApp
      </a>
    </article>
  )
}