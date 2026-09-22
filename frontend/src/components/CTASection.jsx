import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { Reveal } from './motion'
import { WA_BASE, site } from '../data/content'

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
              Enrol for a class or book a Hijaamah session. Message us directly on WhatsApp at{' '}
              <strong>{site.phone}</strong>, and our team will gladly guide you.
            </p>
          </div>
          <div className="cta__actions">
            <a
              href={WA_BASE}
              className="btn btn--lime"
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon={icons.brandWhatsapp} />
              Contact on WhatsApp
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