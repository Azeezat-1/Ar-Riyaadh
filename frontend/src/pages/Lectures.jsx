import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import LectureCard from '../components/LectureCard'
import CTASection from '../components/CTASection'
import { Reveal, StaggerGroup } from '../components/motion'
import { Loader, OfflineNote } from '../components/APIStatus'
import { lectures as staticLectures, site } from '../data/content'
import { getLectures } from '../api/client'
import { lectureFromApi } from '../api/adapters'
import { useApi } from '../api/useApi'

export default function Lectures() {
  const { data: lectures, loading, offline } = useApi(
    () => getLectures().then((items) => items.map(lectureFromApi)),
    staticLectures
  )
  return (
    <PageWrapper>
      <section className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <span className="eyebrow">Lectures</span>
            <h1>Lectures for sisters</h1>
            <p className="lede">
              Lectures delivered by <strong>{site.founder}</strong> are shared for sisters and Muslimahs. Sessions are
              typically held on Fridays and Sundays. Dates below are placeholders until confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Lecture archive"
            title="Recent and upcoming lectures"
            lede="Each lecture addresses a practical, relevant topic for Muslim women. Access details are added for sisters who join."
          />
          {loading ? (
            <Loader label="Loading lectures…" />
          ) : (
            <StaggerGroup className="grid grid--3">
              {lectures.map((l) => (
                <Reveal key={l.id}>
                  <LectureCard {...l} />
                </Reveal>
              ))}
            </StaggerGroup>
          )}
          {offline && <OfflineNote />}
          <p className="muted" style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem' }}>
            More lecture topics will be added here through the academy in the future.
          </p>
        </div>
      </section>

      <CTASection />
    </PageWrapper>
  )
}