import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import TestimonialCard from '../components/TestimonialCard'
import CTASection from '../components/CTASection'
import { Reveal, StaggerGroup } from '../components/motion'
import { Loader } from '../components/APIStatus'
import { testimonials as staticTestimonials } from '../data/content'
import { getTestimonials } from '../api/client'
import { testimonialFromApi } from '../api/adapters'
import { useApi } from '../api/useApi'

export default function Testimonials() {
  const { data: testimonials, loading, offline } = useApi(
    () => getTestimonials().then((items) => items.map(testimonialFromApi)),
    staticTestimonials
  )
  return (
    <PageWrapper>
      <section className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <span className="eyebrow">Testimonials</span>
            <h1>From our students</h1>
            <p className="lede">
              Student experiences with Ar-Riyaadh Academy, shared with gratitude. The academy will
              add new testimonials as students choose to share them.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Student voices"
            title="What students share about learning with us"
          />
          {loading ? (
            <Loader label="Loading testimonials…" />
          ) : (
            <StaggerGroup className="grid grid--3">
              {testimonials.map((t) => (
                <Reveal key={t.id}>
                  <TestimonialCard {...t} />
                </Reveal>
              ))}
            </StaggerGroup>
          )}
          {!loading && testimonials.length === 0 && (
            <p className="muted" style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.88rem' }}>
              New testimonials will appear here as students share their experiences.
            </p>
          )}
        </div>
      </section>

      <CTASection />
    </PageWrapper>
  )
}