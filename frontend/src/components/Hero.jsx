import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { images, TELEGRAM } from '../data/content'
import './Hero.css'

const SLIDES = [
  {
    src: images.heroBackground,
    label: 'The Qur\u02bc\u0101n, the core of the academy\u2019s studies',
  },
  {
    src: images.heroPoster,
    label: 'Knowledge is Light — the academy\u2019s guiding motto',
  },
]

const SLIDE_MS = 6500

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const item = (reduced) => ({
  hidden: { opacity: 0, y: reduced ? 0 : 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
})

export default function Hero() {
  const reduced = useReducedMotion()
  const fade = item(reduced)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  const goTo = (i) => setActive((i + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    if (reduced || paused || SLIDES.length < 2) return undefined
    timer.current = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), SLIDE_MS)
    return () => clearInterval(timer.current)
  }, [reduced, paused])

  return (
    <section
      className="hero hero--overlay"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-label="Al Riyadh Academy hero"
    >
      <div className="hero__slides" aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <motion.img
            key={slide.src}
            src={slide.src}
            alt=""
            className="hero__bg"
            initial={false}
            animate={{
              opacity: i === active ? 1 : 0,
              scale: reduced ? 1 : i === active ? 1.06 : 1,
            }}
            transition={{ opacity: { duration: 1.1, ease: 'easeInOut' }, scale: { duration: SLIDE_MS / 1000, ease: 'linear' } }}
          />
        ))}
        <div className="hero__bg-overlay" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.span variants={fade} className="hero__badge">
              <FontAwesomeIcon icon={icons['book-open']} aria-hidden="true" />
              AL RIYADH ACADEMY
            </motion.span>

            <motion.h1 variants={fade} className="hero__title">
              Seeking Knowledge.
              <br />
              <span className="hero__accent">Growing in Faith.</span>
            </motion.h1>

            <motion.p variants={fade} className="hero__lead">
              Al Riyadh Academy provides structured Islamic and Arabic learning for women and
              girls — Qur'an, Hadith, Tafsir, Arabic and Islamic education, in a peaceful and
              female-focused environment.
            </motion.p>

            <motion.div variants={fade} className="hero__actions">
              <Link to="/classes" className="btn btn--hero">
                Explore Classes
                <FontAwesomeIcon icon={icons['arrow-right']} />
              </Link>
              <a href={TELEGRAM.join} className="btn btn--ghost-light" rel="noreferrer" target="_blank">
                <FontAwesomeIcon icon={icons.telegram} />
                Join a Telegram Class
              </a>
              <Link to="/about" className="btn btn--link">
                Learn More
              </Link>
            </motion.div>

            <motion.ul variants={fade} className="hero__points">
              <li>
                <FontAwesomeIcon icon={icons.check} />
                Qur'an &amp; Tajweed
              </li>
              <li>
                <FontAwesomeIcon icon={icons.check} />
                Arabic, Tafseer &amp; Hadith
              </li>
              <li>
                <FontAwesomeIcon icon={icons.check} />
                Hijaamah instruction
              </li>
            </motion.ul>
          </motion.div>
        </div>
      </div>

      {SLIDES.length > 1 && (
        <div className="hero__controls" role="tablist" aria-label="Hero slides">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={slide.label}
              title={slide.label}
              className={`hero__dot ${active === i ? 'hero__dot--active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}