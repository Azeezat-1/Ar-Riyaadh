import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import Timeline from '../components/Timeline'
import SmartImage from '../components/SmartImage'
import CTASection from '../components/CTASection'
import BooksSection from '../components/BooksSection'
import { Reveal } from '../components/motion'
import { site, images } from '../data/content'

export default function About() {
  return (
    <PageWrapper>
      <section className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <span className="eyebrow">About</span>
            <h1>
              {site.founder}
              <br />
              <span style={{ fontSize: '0.65em', fontWeight: 400, letterSpacing: '0.01em', lineHeight: 1.3, display: 'block', marginTop: '0.4rem' }}>
                A student of knowledge and teacher
              </span>
            </h1>
            <p className="lede">
              {site.founder} is a teacher and Muallima who has dedicated herself to learning and
              teaching Islamic knowledge, learning, persevering, and helping other women and
              girls on their own journey.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'clamp(2rem, 5vw, 4.5rem)', alignItems: 'center' }}>
          <Reveal as="div">
            <span className="eyebrow">Her story</span>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)', margin: '1rem 0 1.1rem', color: 'var(--primary)' }}>
              Not always easy, but worth every step
            </h2>
            <div className="story-body">
              <p>
                She began her journey as a student of knowledge approximately ten years ago,
                learning at <strong>Madrasa Sunnah wal Jama'ah, Iwo, Osun State</strong>.
              </p>
              <p>
                Her journey was not always easy. There were moments that were difficult, times when
                continuing felt heavy, yet she held on. She continued learning, through struggle and
                ease, and Allah facilitated her growth in knowledge.
              </p>
              <p>
                Today, Umm Abdillah Ar-Riyaadh teaches other women and girls, passing on the knowledge
                she gained, with patience and sincerity, through Ar-Riyaadh Academy.
              </p>
              <p className="muted">
                Ar-Riyaadh Academy represents that journey continuing, a space where other women and
                girls can take their own step in the path of seeking beneficial knowledge.
              </p>
            </div>
          </Reveal>
          <Reveal as="div">
            <SmartImage
              src={images.about}
              alt="A woman in hijab studying the Qur'an, the academy's pursuit of authentic knowledge"
              ratio="4 / 5"
              style={{ borderRadius: 'var(--radius-lg)', border: '6px solid var(--warm-white)', boxShadow: 'var(--shadow-lg)' }}
            />
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section--tinted">
        <div className="container">
          <SectionHeading
            eyebrow="Knowledge journey"
            title="A path of learning, perseverance and teaching"
            lede="Her journey, from student to teacher, has been one of patience, growth and a sincere desire to benefit others."
          />
          <Timeline />
        </div>
      </section>

      {/* Books */}
      <BooksSection />

      <CTASection />
    </PageWrapper>
  )
}