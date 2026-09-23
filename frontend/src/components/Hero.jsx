import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { images, TELEGRAM } from '../data/content'
import './Hero.css'

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

  return (
    <section className="hero hero--overlay">
      <img className="hero__bg" src={images.heroBackground} alt="" />
      <div className="hero__bg-overlay" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__content">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.span variants={fade} className="hero__badge">
              AR-RIYAADH ACADEMY
            </motion.span>

            <motion.h1 variants={fade} className="hero__title">
              Seeking Knowledge.
              <br />
              <span className="hero__accent">Growing in Faith.</span>
            </motion.h1>

            <motion.p variants={fade} className="hero__lead">
              Ar-Riyaadh Academy provides structured Islamic and Arabic learning for women and
              girls and Qur'an, Hadith, Tafsir, Arabic and Islamic education, in a peaceful and
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}