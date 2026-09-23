import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { Reveal, StaggerGroup } from './motion'
import { hijama } from '../data/content'

export default function HijamaSection() {
  const highlights = hijama.services.slice(0, 3)

  return (
    <section className="section section--sage" id="hijaamah">
      <div className="container">
        <div className="hijama-split">
          <Reveal as="div" className="hijama-split__story">
            <span className="eyebrow">Hijaamah</span>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)', color: 'var(--primary)', margin: '1rem 0' }}>
              Cupping therapy, practised and taught
            </h2>
            <p className="lede">{hijama.intro}</p>
            <ul className="hijama-points">
              <li>
                <FontAwesomeIcon icon={icons.droplet} aria-hidden="true" />
                Cupping sessions for sisters
              </li>
              <li>
                <FontAwesomeIcon icon={icons.syringe} aria-hidden="true" />
                Acupuncture &amp; cupping, applied correctly
              </li>
              <li>
                <FontAwesomeIcon icon={icons['graduation-cap']} aria-hidden="true" />
                Training for students who wish to learn
              </li>
            </ul>
            <a
              href={hijama.bookLink}
              className="btn btn--primary"
              rel="noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon icon={icons.brandWhatsapp} />
              {hijama.ctaText}
            </a>
          </Reveal>
          <StaggerGroup className="grid grid--2 hijama-split__grid">
            <Reveal>
              <img src={hijama.image} alt="Hijaamah (cupping) therapy, performed with care" className="hijama-split__img" />
            </Reveal>
            {highlights.map((s) => (
              <Reveal key={s.title}>
                <article className="card hijama-card">
                  <div className="icon-wrap icon-wrap--gold">
                    <FontAwesomeIcon icon={icons[s.icon]} aria-hidden="true" />
                  </div>
                  <h3 className="hijama-card__title">{s.title}</h3>
                  <p className="hijama-card__desc">{s.description}</p>
                </article>
              </Reveal>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}