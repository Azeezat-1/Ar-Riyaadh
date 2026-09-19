import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'

export default function SubjectCard({ icon, title, description }) {
  return (
    <article className="card subject-card">
      <div className="icon-wrap">
        <FontAwesomeIcon icon={icons[icon]} aria-hidden="true" />
      </div>
      <h3 className="subject-card__title">{title}</h3>
      <p className="subject-card__desc">{description}</p>
    </article>
  )
}