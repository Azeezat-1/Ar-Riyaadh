import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { LogoMark } from './Header'
import { site, WA_BASE, TELEGRAM } from '../data/content'
import './Footer.css'

const socials = [
  { icon: icons.brandTelegram, label: 'Telegram', href: TELEGRAM.join },
  { icon: icons.brandWhatsapp, label: 'WhatsApp', href: WA_BASE },
  { icon: icons.brandInstagram, label: 'Instagram', href: site.socials.instagram },
  { icon: icons.brandYoutube, label: 'YouTube', href: site.socials.youtube },
]

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Classes', to: '/classes' },
  { label: 'Lectures', to: '/lectures' },
  { label: 'Homeschooling', to: '/homeschooling' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__about">
            <LogoMark />
            <span className="footer__name">{site.fullName}</span>
            <span className="footer__motto">{site.motto}</span>
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
              {footerLinks.map((link) => (
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
                <FontAwesomeIcon icon={icons.brandTelegram} aria-hidden="true" />
                <a href={TELEGRAM.join} rel="noreferrer" target="_blank">
                  Join classes on Telegram
                </a>
              </li>
              <li>
                <FontAwesomeIcon icon={icons.brandWhatsapp} aria-hidden="true" />
                <a href={WA_BASE} rel="noreferrer" target="_blank">
                  {site.phone}
                </a>
              </li>
              <li>
                <FontAwesomeIcon icon={icons.envelope} aria-hidden="true" />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <FontAwesomeIcon icon={icons['location-dot']} aria-hidden="true" />
                <span>Online classes via Telegram</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.motto} · Azeezat Yusuf
          </p>
        </div>
      </div>
    </footer>
  )
}