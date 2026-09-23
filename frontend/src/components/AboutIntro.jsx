import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import SmartImage from './SmartImage'
import { Reveal } from './motion'
import { aboutIntro, images } from '../data/content'

export default function AboutIntro() {
  return (
    <section className="section">
      <div className="container">
        <div className="about-intro__split">
          <Reveal as="div" className="about-intro__media">
            <SmartImage
              src={images.about}
              alt="A woman in hijab studying the Qur'an, the academy's pursuit of authentic knowledge"
              ratio="4 / 5"
              className="about-intro__img"
            />
          </Reveal>
          <Reveal as="div" className="about-intro__story" delay={0.1}>
            <span className="eyebrow">{aboutIntro.eyebrow}</span>
            <h2 className="about-intro__title">{aboutIntro.title}</h2>
            <p className="about-intro__lede">{aboutIntro.lede}</p>
            <div className="about-intro__paras">
              {aboutIntro.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <ul className="about-intro__badges">
              {aboutIntro.badges.map((b) => (
                <li key={b.title} className="about-intro__badge">
                  <span className="icon-wrap">
                    <FontAwesomeIcon icon={icons[b.icon]} aria-hidden="true" />
                  </span>
                  <span>{b.title}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn btn--primary about-intro__cta">
              {aboutIntro.ctaText}
              <FontAwesomeIcon icon={icons['arrow-right']} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}