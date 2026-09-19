import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'

export default function ClassCard({ icon, category, title, audience, description, focus, schedule, telegramLink }) {
  return (
    <article className="card class-card">
      <div className="class-card__head">
        <span className="pill">{category}</span>
        <span className="pill pill--gold">
          <FontAwesomeIcon icon={icons.clock} aria-hidden="true" />
          {schedule}
        </span>
      </div>
      <div className="icon-wrap icon-wrap--gold">
        <FontAwesomeIcon icon={icons[icon]} aria-hidden="true" />
      </div>
      <h3 className="class-card__title">{title}</h3>
      <span className="class-card__audience">{audience}</span>
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