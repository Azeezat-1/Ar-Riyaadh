import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'

export default function ClassCard({ icon, category, title, description, focus, telegramLink }) {
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
        href={telegramLink}
        className="btn btn--primary btn--sm class-card__cta"
        rel="noreferrer"
        target="_blank"
      >
        <FontAwesomeIcon icon={icons.brandTelegram} />
        Join This Class
      </a>
    </article>
  )
}