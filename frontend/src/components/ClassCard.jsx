import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { TELEGRAM } from '../data/content'

export default function ClassCard({ icon, category, title, description, focus, audience, schedule, link }) {
  const joinTo = link || TELEGRAM.join
  return (
    <article className="card class-card">
      <span className="pill">{category}</span>
      <div className="icon-wrap icon-wrap--gold">
        <FontAwesomeIcon icon={icons[icon]} aria-hidden="true" />
      </div>
      <h3 className="class-card__title">{title}</h3>
      <p className="class-card__desc">{description}</p>
      {audience && <p className="class-card__meta">{audience}</p>}
      {schedule && <p className="class-card__meta class-card__meta--schedule">{schedule}</p>}
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
        href={joinTo}
        className="btn btn--primary btn--sm class-card__cta"
        rel="noreferrer"
        target="_blank"
      >
        <FontAwesomeIcon icon={icons.telegram} />
        Join This Class
      </a>
    </article>
  )
}