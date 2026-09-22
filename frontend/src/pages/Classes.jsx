import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import ClassCard from '../components/ClassCard'
import CTASection from '../components/CTASection'
import { Reveal, StaggerGroup } from '../components/motion'
import { Loader } from '../components/APIStatus'
import { icons } from '../components/icons'
import { classes as staticClasses, classCategories, WA_BASE } from '../data/content'
import { getClasses } from '../api/client'
import { classFromApi } from '../api/adapters'
import { useApi } from '../api/useApi'

export default function Classes() {
  const [filter, setFilter] = useState('all')
  const { data: classes, loading, offline } = useApi(
    () => getClasses().then((items) => items.map(classFromApi)),
    staticClasses
  )
  const visible = filter === 'all' ? classes : classes.filter((c) => c.category === filter)

  return (
    <PageWrapper>
      <section className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <span className="eyebrow">Classes & programs</span>
            <h1>Classes</h1>
            <p className="lede">
              Interactive live and self-paced classes in Qur'an, Arabic, Tafseer and Hadith.
              Select a class and enrol directly through WhatsApp.
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

          {loading ? (
            <Loader label="Loading classes…" />
          ) : (
            <StaggerGroup className="grid grid--2">
              {visible.map((c) => (
                <Reveal key={c.id}>
                  <ClassCard {...c} />
                </Reveal>
              ))}
            </StaggerGroup>
          )}


          {!loading && visible.length === 0 && (
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
            lede="Choose a class above and message us on WhatsApp to enrol. You are welcome to ask about the right starting point for you."
          />
          <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={WA_BASE} className="btn btn--primary" rel="noreferrer" target="_blank">
              <FontAwesomeIcon icon={icons.brandWhatsapp} />
              Ask About a Class
            </a>
            <a href={WA_BASE} className="btn btn--gold" rel="noreferrer" target="_blank">
              <FontAwesomeIcon icon={icons.brandWhatsapp} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </PageWrapper>
  )
}