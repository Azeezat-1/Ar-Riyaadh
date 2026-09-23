import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../components/icons'
import PageWrapper from '../components/PageWrapper'
import Hero from '../components/Hero'
import AboutIntro from '../components/AboutIntro'
import SectionHeading from '../components/SectionHeading'
import SubjectCard from '../components/SubjectCard'
import ClassCard from '../components/ClassCard'
import LectureCard from '../components/LectureCard'
import TestimonialCard from '../components/TestimonialCard'
import Timeline from '../components/Timeline'
import CTASection from '../components/CTASection'
import BooksSection from '../components/BooksSection'
import HijamaSection from '../components/HijamaSection'
import LearnArabicSection from '../components/LearnArabicSection'
import SmartImage from '../components/SmartImage'
import { Reveal, StaggerGroup } from '../components/motion'
import { Loader } from '../components/APIStatus'
import {
  subjects,
  classes as staticClasses,
  lectures as staticLectures,
  testimonials as staticTestimonials,
  images,
  values,
} from '../data/content'
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
  const featuredClasses = liveClasses.slice(0, 4)

  return (
    <PageWrapper>
      <Hero />

      {/* About Umm Abdillah */}
      <AboutIntro />

      {/* What we teach */}
      <section className="section section--tinted" id="teach">
        <div className="container">
          <SectionHeading
            eyebrow="Subjects & programs"
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

      {/* Classes & Programs */}
      <section className="section" id="classes">
        <div className="container">
          <SectionHeading
            eyebrow="Classes & programs"
            title="Choose your learning path"
            lede="Interactive live and self-paced programs taught by Umm Abdillah Ar-Riyaadah. Enrol directly through WhatsApp."
          />
          {loadingClasses ? (
            <Loader label="Loading classes…" />
          ) : (
            <StaggerGroup className="grid grid--4">
              {featuredClasses.map((c) => (
                <Reveal key={c.id}>
                  <ClassCard {...c} />
                </Reveal>
              ))}
            </StaggerGroup>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/classes" className="btn btn--primary">
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
              <img src={images.hadithImage} alt="Journey to Hadith — a guided 30-day programme for Muslim women" className="hadith-split__img" />
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

      {/* Free & public lectures */}
      <section className="section section--tinted">
        <div className="container">
          <SectionHeading
            eyebrow="Free & public lectures"
            title="Recordings, weekly lectures & webinars"
            lede="Curated lectures on faith, family and everyday life, hosted by Umm Abdillah Ar-Riyaadah. Join live or revisit the recordings."
          />
          <StaggerGroup className="grid grid--3">
            {staticLectures.slice(0, 3).map((l) => (
              <Reveal key={l.id}>
                <LectureCard {...l} />
              </Reveal>
            ))}
          </StaggerGroup>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/lectures" className="btn btn--outline">
              View All Lectures
              <FontAwesomeIcon icon={icons['arrow-right']} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials preview */}
      <section className="section section--green section--compact">
        <div className="container">
          <SectionHeading
            eyebrow="Student experiences"
            title="From those who learnt with us"
            lede="Real words from students, their courses and their transformations in Qur'an, Arabic and Hijaamah."
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