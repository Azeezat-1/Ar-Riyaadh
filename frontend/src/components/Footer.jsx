import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { navLinks, site } from '../data/content'
import './Footer.css'

const socials = [
  { icon: icons.brandTelegram, label: 'Telegram', href: site.socials.telegram },
  { icon: icons.brandWhatsapp, label: 'WhatsApp', href: site.socials.whatsapp },
  { icon: icons.brandInstagram, label: 'Instagram', href: site.socials.instagram },
  { icon: icons.brandYoutube, label: 'YouTube', href: site.socials.youtube },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__about">
            <span className="footer__name">{site.name}</span>
            <p className="footer__desc">
              {site.tagline} Structured Islamic and Arabic learning taught by {site.founder}.
            </p>
            <ul className="footer__socials">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label} rel="noreferrer" target="_blank">
                    <FontAwesomeIcon icon={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            <span className="footer__heading">Navigate</span>
            <ul>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__contact">
            <span className="footer__heading">Contact</span>
            <ul>
              <li>
                <FontAwesomeIcon icon={icons.envelope} aria-hidden="true" />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <FontAwesomeIcon icon={icons.phone} aria-hidden="true" />
                <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
              </li>
              <li>
                <FontAwesomeIcon icon={icons['location-dot']} aria-hidden="true" />
                <span>Available online via Telegram</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {site.name} · Website by Azeezat Yusuf
          </p>
          <p className="footer__note">
            Curriculum and lectures are conducted by {site.founder}, a Muallima and student of
            knowledge.
          </p>
        </div>
      </div>
    </footer>
  )
}