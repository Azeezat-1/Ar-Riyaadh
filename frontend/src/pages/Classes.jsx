import { useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import ClassCard from '../components/ClassCard'
import CTASection from '../components/CTASection'
import { Reveal, StaggerGroup } from '../components/motion'
import { classes, classCategories } from '../data/content'

export default function Classes() {
  const [filter, setFilter] = useState('all')
  const visible = filter === 'all' ? classes : classes.filter((c) => c.category === filter)

  return (
    <PageWrapper>
      <section className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <span className="eyebrow">Telegram classes</span>
            <h1>Classes</h1>
            <p className="lede">
              Classes are currently held through Telegram. Select the class you're interested in
              and follow the provided link, or contact the academy to request access.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Browse classes"
            title="Find the right class for you"
            lede="Each class is structured around a clear focus, and sisters are welcome to join at the level that suits them."
          />

          <div className="filter-row" role="group" aria-label="Filter classes by category">
            {classCategories.map((cat) => (
              <button
                key={cat.value}
                className="chip"
                aria-pressed={filter === cat.value}
                onClick={() => setFilter(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <StaggerGroup className="grid grid--2">
            {visible.map((c) => (
              <Reveal key={c.id}>
                <ClassCard {...c} />
              </Reveal>
            ))}
          </StaggerGroup>

          {visible.length === 0 && (
            <p className="muted" style={{ textAlign: 'center', marginTop: '2rem' }}>
              No classes in this category yet. Contact the academy to ask about upcoming options.
            </p>
          )}
        </div>
      </section>

      <section className="section section--tinted" id="join-cta">
        <div className="container container--narrow" style={{ textAlign: 'center' }}>
          <SectionHeading
            eyebrow="Ready to join?"
            title="How do I join a class?"
            lede="Choose a class above, follow the Telegram link, or contact the academy directly. You are welcome to ask about the right starting point for you."
          />
          <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#" className="btn btn--primary">
              Ask About a Class
            </a>
            <a href="#" className="btn btn--gold">
              Join a Telegram Class
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </PageWrapper>
  )
}