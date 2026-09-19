import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import SmartImage from './SmartImage'
import { images } from '../data/content'
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
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <rect width="1440" height="900" fill="#f6f1e7" />
          <circle cx="1180" cy="120" r="380" fill="#e3ece2" opacity="0.6" />
          <circle cx="200" cy="760" r="330" fill="#c9d8c7" opacity="0.4" />
          <path
            d="M-40 640C240 520 520 760 780 660s480-70 700 40v260H-40z"
            fill="#e9e0cf"
            opacity="0.55"
          />
          <path d="M1300 80l140 140-140 140L1160 220z" fill="#c9a961" opacity="0.18" transform="rotate(10 1300 220)" />
        </svg>
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.span variants={fade} className="eyebrow">
              Ar-Riyadh Academy
            </motion.span>

            <motion.h1 variants={fade} className="hero__title">
              Seeking Knowledge.
              <br />
              <em>Growing in Faith.</em>
            </motion.h1>

            <motion.p variants={fade} className="hero__lead">
              Ar-Riyadh Academy provides structured Islamic and Arabic learning for women and
              girls — Qur&rsquo;an, Hadith, Tafsir, Arabic and Islamic studies, taught online by
              Umu Abdullah Riyadh.
            </motion.p>

            <motion.div variants={fade} className="hero__actions">
              <Link to="/classes" className="btn btn--primary">
                Explore Classes
                <FontAwesomeIcon icon={icons['arrow-right']} />
              </Link>
              <a href="#join-cta" className="btn btn--gold">
                <FontAwesomeIcon icon={icons.brandTelegram} />
                Join a Telegram Class
              </a>
              <Link to="/about" className="btn btn--outline">
                Learn More
              </Link>
            </motion.div>

            <motion.ul variants={fade} className="hero__points">
              <li>
                <FontAwesomeIcon icon={icons.check} />
                Qur&rsquo;an &amp; Hadith
              </li>
              <li>
                <FontAwesomeIcon icon={icons.check} />
                Tafsir &amp; Arabic
              </li>
              <li>
                <FontAwesomeIcon icon={icons.check} />
                For women &amp; girls
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
              alt="A Muslim woman in hijab reading, focused on learning"
            />
            <span className="hero__caption">
              <FontAwesomeIcon icon={icons['graduation-cap']} />
              Students of knowledge
            </span>
          </div>
          <div className="hero__frame hero__frame--side">
            <SmartImage
              src={images.heroSecondary}
              alt="A calm reading room with bookshelves at the academy"
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