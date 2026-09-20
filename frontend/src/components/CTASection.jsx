import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { Reveal } from './motion'

export default function CTASection({ id }) {
  return (
    <section id={id || 'join-cta'} className="section cta" aria-labelledby="cta-title">
      <div className="container" >
        <Reveal as="div" className="cta__card">
          <div className="cta__content">
            <span className="eyebrow eyebrow--light">Begin your journey</span>
            <h2 id="cta-title" className="cta__title">
              Take the first step towards beneficial knowledge
            </h2>
            <p className="cta__text">
              Classes are held for sisters through Telegram. Choose a class, follow the provided
              link, or contact us to request access.
            </p>
          </div>
          <div className="cta__actions">
            <a
              href="#"
              className="btn btn--lime"
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon={icons.brandTelegram} />
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