import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { LECTURES_CHANNEL } from '../data/content'

export default function LectureCard({ topic, title, excerpt, tags, schedule, audience, status }) {
  return (
    <article className="card lecture-card">
      <div className="lecture-card__head">
        <span className="pill">{topic}</span>
        {status && (
          <span className={`pill ${status === 'Ongoing' ? 'pill--green' : 'pill--gold'}`}>
            {status}
          </span>
        )}
      </div>
      <h3 className="lecture-card__title">{title}</h3>
      <p className="lecture-card__desc">{excerpt}</p>
      <ul className="lecture-card__meta">
        <li>
          <FontAwesomeIcon icon={icons['calendar-days']} aria-hidden="true" />
          {schedule}
        </li>
        <li>
          <FontAwesomeIcon icon={icons['people-group']} aria-hidden="true" />
          {audience}
        </li>
      </ul>
      {tags && (
        <div className="lecture-card__tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
      <a
        href={LECTURES_CHANNEL}
        className="btn btn--outline btn--sm lecture-card__cta"
        rel="noreferrer"
        target="_blank"
      >
        <FontAwesomeIcon icon={icons['play-circle']} />
        Access Lecture
      </a>
    </article>
  )
}