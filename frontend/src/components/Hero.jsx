import { motion, useReducedMotion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import SmartImage from './SmartImage'
import { images, WA_BASE } from '../data/content'
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
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <img src={images.heroBackground} alt="" />
        <div className="hero__bg-overlay" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.span variants={fade} className="eyebrow">
              Ar-Riyaadh Academy
            </motion.span>

            <motion.h1 variants={fade} className="hero__title">
              Empowering Souls Through Authentic
              <br />
              <em>Islamic Knowledge &amp; Holistic Wellness.</em>
            </motion.h1>

            <motion.p variants={fade} className="hero__lead">
              Learn Quran recitation, Arabic fluency, Tafseer, and Hadith memorization with
              Umm Abdillah Ar-Riyaadah.
            </motion.p>

            <motion.div variants={fade} className="hero__actions">
              <a href="#classes" className="btn btn--primary">
                Explore Classes
                <FontAwesomeIcon icon={icons['arrow-right']} />
              </a>
              <a href={WA_BASE} className="btn btn--lime" rel="noreferrer" target="_blank">
                <FontAwesomeIcon icon={icons.brandWhatsapp} />
                Chat on WhatsApp
              </a>
            </motion.div>

            <motion.ul variants={fade} className="hero__points">
              <li>
                <FontAwesomeIcon icon={icons.check} />
                Qur&rsquo;an &amp; Tajweed
              </li>
              <li>
                <FontAwesomeIcon icon={icons.check} />
                Arabic, Tafseer &amp; Hadith
              </li>
              <li>
                <FontAwesomeIcon icon={icons.check} />
                Holistic Sunnah Hijama
              </li>
            </motion.ul>
          </motion.div>
        </div>

        <motion.div
          className="hero__media"
          initial={reduced ? undefined : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <div className="hero__frame hero__frame--main">
            <SmartImage
              src={images.heroPrimary}
              alt="The Qur'an open on a wooden stand, the core of the academy's studies"
            />
            <span className="hero__caption">
              <FontAwesomeIcon icon={icons['graduation-cap']} />
              Students of knowledge
            </span>
          </div>
          <div className="hero__frame hero__frame--side">
            <SmartImage
              src={images.heroSecondary}
              alt="Knowledge is Light — the academy's learning poster"
            />
            <span className="hero__caption hero__caption--alt">
              <FontAwesomeIcon icon={icons['book-open']} />
              A place to learn
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}