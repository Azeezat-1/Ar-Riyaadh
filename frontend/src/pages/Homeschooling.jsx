import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../components/icons'
import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import ArticleCard from '../components/ArticleCard'
import SmartImage from '../components/SmartImage'
import CTASection from '../components/CTASection'
import { Reveal, StaggerGroup } from '../components/motion'
import { Loader } from '../components/APIStatus'
import { homeschoolArticles, images } from '../data/content'
import { getArticleBySlug, getArticles } from '../api/client'
import { articleDetailFromApi, articleFromApi } from '../api/adapters'
import { useApi } from '../api/useApi'

export default function Homeschooling() {
  const { data: articles, loading, offline } = useApi(
    () => getArticles().then((items) => items.map(articleFromApi)),
    homeschoolArticles
  )
  return (
    <PageWrapper>
      <section className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <span className="eyebrow">Homeschooling</span>
            <h1>Homeschooling from an Islamic Perspective</h1>
            <p className="lede">
              Personal reflections on homeschooling, as a mother, a teacher and a student of
              knowledge. Islamic principles that guide education and raising children with Islamic
              values, shared as experience rather than a universal claim.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Articles & reflections"
            title="Lessons from the journey"
            lede="An evolving space where Umm Abdillah Ar-Riyaadh shares reflections on education, tarbiyah and family life through an Islamic lens."
          />
          {loading ? (
            <Loader label="Loading articles…" />
          ) : (
            <StaggerGroup className="grid grid--3">
              {articles.map((a) => (
                <Reveal key={a.slug}>
                  <ArticleCard {...a} />
                </Reveal>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>

      <section className="section section--tinted">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'center' }}>
          <Reveal as="div">
            <SmartImage src={images.study} alt="A young female student studying at a desk" ratio="4 / 3" />
          </Reveal>
          <Reveal as="div">
            <span className="eyebrow">Experience & perspective</span>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.4rem)', margin: '1rem 0 1rem', color: 'var(--primary)' }}>
              Education and tarbiyah, together
            </h2>
            <div className="story-body">
              <p>
                Homeschooling, for us, is a way to combine education with tarbiyah, nurturing the
                child's faith, character and love of learning alongside their books.
              </p>
              <p>
                My experience as a mother and a teacher has shown that learning happens steadily,
                in daily moments, more than in sudden leaps. Patience, consistency and trust in
                Allah are at the heart of it.
              </p>
              <p>
                This section will grow with practical reflections and resources. What is shared
                here is our experience, presented honestly, as one family's journey, not as a
                claim that one way suits everyone.
              </p>
            </div>
            <a href="#join-cta" className="btn btn--outline" style={{ marginTop: '1.5rem' }}>
              Explore Homeschooling
              <FontAwesomeIcon icon={icons['arrow-right']} />
            </a>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </PageWrapper>
  )
}

export function HomeschoolingArticleDetail() {
  const { slug } = useParams()
  const fallback = homeschoolArticles.find((a) => a.slug === slug)
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setOffline(false)
    getArticleBySlug(slug)
      .then((a) => active && setArticle(articleDetailFromApi(a)))
      .catch(() => {
        if (!active) return
        setOffline(true)
        setArticle(fallback && fallback.slug ? { ...fallback } : null)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <PageWrapper>
        <Loader label="Loading article…" />
      </PageWrapper>
    )
  }

  if (!article) {
    return (
      <PageWrapper>
        <section className="page-head">
          <div className="container">
            <div className="page-head__inner">
              <h1>Article not found</h1>
              <p className="lede">The article you're looking for does not exist.</p>
              <Link to="/homeschooling" className="btn btn--primary">
                Back to Homeschooling
              </Link>
            </div>
          </div>
        </section>
      </PageWrapper>
    )
  }

  const legacyBody = article.content || (
    <>
      <p>
        This article will be filled in with the full writing by Umm Abdillah Ar-Riyaadh. It will share
        the perspective and experience promised in the introduction, practical, honest reflections
        on homeschooling from an Islamic viewpoint.
      </p>
      <p>
        The article system is ready for the academy's own content: each piece has a title, slug,
        excerpt, full content body, category, author and date, easy to manage without touching the
        rest of the website.
      </p>
    </>
  )

  return (
    <PageWrapper>
      <article>
        <section className="page-head">
          <div className="container container--narrow">
            <Reveal as="div" className="page-head__inner">
              <Link to="/homeschooling" className="badge">
                <FontAwesomeIcon icon={icons['arrow-right']} style={{ transform: 'rotate(180deg)' }} />
                Back to all articles
              </Link>
              {article.category && <span className="pill">{article.category}</span>}
              <h1>{article.title}</h1>
              <p className="lede">{article.excerpt}</p>
              <span className="muted small">
                By {article.author} · {article.publishedAt}
              </span>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="container container--narrow">
            <Reveal as="div" className="article-detail">
              {article.cover ? (
                <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem' }}>
                  <SmartImage src={article.cover} alt={`Cover for ${article.title}`} ratio="16 / 9" />
                </div>
              ) : (
                <div className="article-placeholder" role="img" aria-label="Article cover placeholder">
                  <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <rect width="1200" height="500" fill="#1f3b32" />
                    <circle cx="1020" cy="80" r="180" fill="#2f5547" />
                    <rect x="120" y="180" width="200" height="8" rx="4" fill="#c9a961" />
                    <rect x="120" y="210" width="420" height="8" rx="4" fill="#f4ebdd" opacity="0.85" />
                    <rect x="120" y="230" width="360" height="8" rx="4" fill="#f4ebdd" opacity="0.6" />
                    <rect x="120" y="250" width="300" height="8" rx="4" fill="#f4ebdd" opacity="0.45" />
                  </svg>
                </div>
              )}
              <div className="story-body">{legacyBody}</div>
            </Reveal>
          </div>
        </section>
      </article>

      <CTASection />
    </PageWrapper>
  )
}