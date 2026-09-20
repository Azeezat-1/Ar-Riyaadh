import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import SmartImage from './SmartImage'
import { Reveal } from './motion'
import { images, learnArabic } from '../data/content'

export default function LearnArabicSection() {
  return (
    <section className="section section--green section--arabic" id="learn-arabic">
      <div className="container">
        <div className="learn-arabic__grid">
          <Reveal as="div" className="learn-arabic__media">
            <div className="learn-arabic__frame">
              <SmartImage src={images.arabicProgram} alt="The academy's Arabic-speaking programme" ratio="1 / 1" />
            </div>
          </Reveal>
          <Reveal as="div" className="learn-arabic__content" delay={0.15}>
            <span className="eyebrow eyebrow--lime">{learnArabic.eyebrow}</span>
            <h2 className="learn-arabic__title">{learnArabic.title}</h2>
            <p className="learn-arabic__lede">{learnArabic.lede}</p>
            <ul className="learn-arabic__points">
              {learnArabic.points.map((p) => (
                <li key={p}>
                  <FontAwesomeIcon icon={icons.check} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="learn-arabic__actions">
              <Link to={learnArabic.ctaTo} className="btn btn--lime">
                {learnArabic.ctaText}
                <FontAwesomeIcon icon={icons['arrow-right']} />
              </Link>
              <Link to="/contact" className="btn btn--ghost-light">
                Ask a question
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}