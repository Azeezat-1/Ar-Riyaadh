import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../components/icons'
import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import { Reveal, StaggerGroup } from '../components/motion'
import { hijama } from '../data/content'

export default function Hijaamah() {
  return (
    <PageWrapper>
      <section className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <span className="eyebrow">Hijaamah</span>
            <h1>Hijaamah, Cupping Therapy</h1>
            <p className="lede">
              {hijama.intro}
            </p>
            <div className="hijama-page__visual">
              <img src={hijama.image} alt="Hijaamah (cupping) therapy, performed with care" className="hijama-page__img" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What is offered"
            title={hijama.tagline}
            lede="Performed for sisters and taught to students, with care, cleanliness and the discipline the practice requires."
          />
          <StaggerGroup className="grid grid--4">
            {hijama.services.map((s) => (
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
      </section>

      {/* How it works */}
      <section className="section section--tinted">
        <div className="container container--narrow">
          <SectionHeading
            eyebrow="How it works"
            title="Your hijaamah journey"
          />
          <StaggerGroup className="steps">
            {hijama.howItWorks.map((step, i) => (
              <Reveal key={step} className="step">
                <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </Reveal>
            ))}
          </StaggerGroup>
          <Reveal as="div" className="hijama-note">
            <FontAwesomeIcon icon={icons['circle-info']} aria-hidden="true" />
            <p>{hijama.note}</p>
          </Reveal>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to={hijama.bookLink} className="btn btn--primary">
              <FontAwesomeIcon icon={icons.telegram} />
              {hijama.ctaText}
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </PageWrapper>
  )
}