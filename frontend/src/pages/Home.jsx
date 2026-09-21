import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../components/icons'
import PageWrapper from '../components/PageWrapper'
import Hero from '../components/Hero'
import SectionHeading from '../components/SectionHeading'
import SubjectCard from '../components/SubjectCard'
import ClassCard from '../components/ClassCard'
import TestimonialCard from '../components/TestimonialCard'
import Timeline from '../components/Timeline'
import CTASection from '../components/CTASection'
import BooksSection from '../components/BooksSection'
import HijamaSection from '../components/HijamaSection'
import LearnArabicSection from '../components/LearnArabicSection'
import SmartImage from '../components/SmartImage'
import { Reveal, StaggerGroup } from '../components/motion'
import { Loader } from '../components/APIStatus'
import { subjects, classes as staticClasses, testimonials as staticTestimonials, images, values } from '../data/content'
import { getClasses, getTestimonials } from '../api/client'
import { classFromApi, testimonialFromApi } from '../api/adapters'
import { useApi } from '../api/useApi'

export default function Home() {
  const { data: liveClasses, loading: loadingClasses, offline: offlineClasses } = useApi(
    () => getClasses().then((items) => items.map(classFromApi)),
    staticClasses
  )
  const { data: liveTestimonials, loading: loadingTestimonials, offline: offlineTestimonials } = useApi(
    () => getTestimonials().then((items) => items.map(testimonialFromApi)),
    staticTestimonials
  )
  const featuredClasses = liveClasses.slice(0, 3)

  return (
    <PageWrapper>
      <Hero />

      {/* What we teach */}
      <section className="section" id="teach">
        <div className="container">
          <SectionHeading
            eyebrow="What we teach"
            title="A structured path to beneficial knowledge"
            lede="Ar-Riyaadh Academy helps women and girls build a strong, steady connection to the Qur'án and the Islamic sciences, taught clearly, step by step."
          />
          <StaggerGroup className="grid grid--3">
            {subjects.map((s) => (
              <Reveal key={s.id}>
                <SubjectCard {...s} />
              </Reveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Featured classes */}
      <section className="section section--tinted" id="classes">
        <div className="container">
          <SectionHeading
            eyebrow="Telegram classes"
            title="Featured classes"
            lede="Classes are held for sisters through Telegram. Interested in joining? Select a class and follow the provided link, or contact the academy for access."
          />
          {loadingClasses ? (
            <Loader label="Loading classes…" />
          ) : (
            <StaggerGroup className="grid grid--3">
              {featuredClasses.map((c) => (
                <Reveal key={c.id}>
                  <ClassCard {...c} />
                </Reveal>
              ))}
            </StaggerGroup>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/classes" className="btn btn--outline">
              View All Classes
              <FontAwesomeIcon icon={icons['arrow-right']} />
            </Link>
          </div>
        </div>
      </section>

      {/* Learn Arabic */}
      <LearnArabicSection />

      {/* Hadith feature */}
      <section className="section">
        <div className="container">
          <div className="hadith-split">
            <Reveal as="div" className="hadith-feature">
              <FontAwesomeIcon icon={icons['book-open']} className="hadith-feature__icon" aria-hidden="true" />
              <p className="arabic hadith-feature__arabic">مَن سَلَكَ طَرِيقًا يَلتَمِسُ فِيهِ عِلمًا سَهَّلَ اللهُ لَهُ بِهِ طَرِيقًا إِلَى الجَنَّةِ</p>
              <blockquote className="hadith-feature__quote">
                “Whoever takes a path in which he seeks knowledge, Allah will make easy for him a
                path to Paradise.”
              </blockquote>
              <span className="hadith-feature__ref">Sahih Muslim</span>
            </Reveal>
            <Reveal as="div" className="hadith-split__visual" delay={0.15}>
              <img src={images.hadithImage} alt="Seeking knowledge, the academy's lesson poster" className="hadith-split__img" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 25. Why Ar-Riyaadh Academy */}
      <section className="section section--tinted">
        <div className="container">
          <SectionHeading
            eyebrow="Our values"
            title="Why Ar-Riyaadh Academy"
            lede="Simple, sincere principles shape how we welcome and teach every student."
          />
          <StaggerGroup className="grid grid--3">
            {(images.library) && (
              <Reveal>
                <div className="value-cover">
                  <SmartImage
                    src={images.library}
                    alt="A calm, studied library space"
                    ratio="3 / 4"
                  />
                </div>
              </Reveal>
            )}
            {values.slice(0, 5).map((v) => (
              <Reveal key={v.title}>
                <article className="card value-card">
                  <div className="icon-wrap">
                    <FontAwesomeIcon icon={icons[v.icon]} aria-hidden="true" />
                  </div>
                  <h3 className="value-card__title">{v.title}</h3>
                  <p className="value-card__desc">{v.description}</p>
                </article>
              </Reveal>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Journey preview */}
      <section className="section section--sand">
        <div className="container">
          <SectionHeading
            eyebrow="Knowledge journey"
            title="The story behind the academy"
            lede="Ar-Riyaadh Academy grew out of a personal journey as a student of knowledge, learning, persevering, and then teaching others."
          />
          <Timeline />
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/about" className="btn btn--outline">
              Read the Full Story
              <FontAwesomeIcon icon={icons['arrow-right']} />
            </Link>
          </div>
        </div>
      </section>

      {/* Books */}
      <BooksSection />

      {/* Hijaamah */}
      <HijamaSection />

      {/* Testimonials preview */}
      <section className="section section--green section--compact">
        <div className="container">
          <SectionHeading
            eyebrow="Student experiences"
            title="From those who learnt with us"
            lede="Words from students, their own experiences and gratitude. More can be added through the academy."
          />
          {loadingTestimonials ? (
            <Loader label="Loading testimonials…" />
          ) : (
            <StaggerGroup className="grid grid--3">
              {liveTestimonials.map((t) => (
                <Reveal key={t.id}>
                  <TestimonialCard {...t} />
                </Reveal>
              ))}
            </StaggerGroup>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/testimonials" className="btn btn--ghost-light">
              View All Testimonials
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </PageWrapper>
  )
}