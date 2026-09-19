import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import TestimonialCard from '../components/TestimonialCard'
import CTASection from '../components/CTASection'
import { Reveal, StaggerGroup } from '../components/motion'
import { testimonials } from '../data/content'

export default function Testimonials() {
  return (
    <PageWrapper>
      <section className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <span className="eyebrow">Testimonials</span>
            <h1>From our students</h1>
            <p className="lede">
              Student experiences with Ar-Riyadh Academy — shared with gratitude. The academy will
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
          <StaggerGroup className="grid grid--3">
            {testimonials.map((t) => (
              <Reveal key={t.id}>
                <TestimonialCard {...t} />
              </Reveal>
            ))}
          </StaggerGroup>
          <p className="muted" style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.88rem' }}>
            Placeholder testimonials are clearly marked and easy to replace with real student
            experiences.
          </p>
        </div>
      </section>

      <CTASection />
    </PageWrapper>
  )
}