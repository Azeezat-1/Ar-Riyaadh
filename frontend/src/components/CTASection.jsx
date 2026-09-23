import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { Reveal } from './motion'
import { TELEGRAM } from '../data/content'

export default function CTASection({ id }) {
  return (
    <section id={id || 'join-cta'} className="section cta" aria-labelledby="cta-title">
      <div className="container">
        <Reveal as="div" className="cta__card">
          <div className="cta__content">
            <span className="eyebrow eyebrow--light">Get in touch</span>
            <h2 id="cta-title" className="cta__title">
              Start your journey today
            </h2>
            <p className="cta__text">
              Join a Telegram class, enrol for a lecture, or ask about Hijaamah instruction. Select a
              class and follow the provided link, or contact the academy for guidance.
            </p>
          </div>
          <div className="cta__actions">
            <a href={TELEGRAM.join} className="btn btn--lime" rel="noreferrer" target="_blank">
              <FontAwesomeIcon icon={icons.telegram} />
              Join a Telegram Class
            </a>
            <Link to="/classes" className="btn btn--ghost-light">
              Explore Classes
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}