import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import ClassCard from '../components/ClassCard'
import CTASection from '../components/CTASection'
import { Reveal, StaggerGroup } from '../components/motion'
import { Loader } from '../components/APIStatus'
import { icons } from '../components/icons'
import { classes as staticClasses, classCategories, TELEGRAM } from '../data/content'
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
              Interactive classes in Qur'an, Hadith, Tafsir, Arabic Language and Islamic Studies.
              Select a class and join or request access through Telegram.
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
            lede="Interested in joining a class? Select the class you're interested in and follow the provided Telegram link or contact the appropriate person for access."
          />
          <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={TELEGRAM.join} className="btn btn--primary" rel="noreferrer" target="_blank">
              <FontAwesomeIcon icon={icons.telegram} />
              Join a Telegram Class
            </a>
            <Link to="/contact" className="btn btn--gold">
              Ask About a Class
            </Link>
          </div>
          <p className="muted" style={{ marginTop: '1.25rem', fontSize: '0.85rem' }}>
            Telegram links are placeholders and will point to the academy's real class groups when provided.
          </p>
        </div>
      </section>

      <CTASection />
    </PageWrapper>
  )
}