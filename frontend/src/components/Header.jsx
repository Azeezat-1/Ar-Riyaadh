import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { navLinks, site } from '../data/content'
import './Header.css'

// The academy logo. Drop a real logo file at public/logo.png and it
// automatically replaces this placeholder SVG everywhere.
export function LogoMark() {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="40" height="40" role="img">
        <rect width="64" height="64" rx="14" fill="#1F3B32" />
        <path
          d="M32 18c-3.2-2.5-7.6-3.4-12-3-1.2.1-2.5 1.9-2.5 3.1v25.4c0 1.2 1.2 2.2 2.4 2.1 4.3-.4 8.5.4 11.8 2.8 0 0 0 0 .3 0s.3 0 .3 0c3.3-2.4 7.5-3.2 11.8-2.8 1.2.1 2.4-.9 2.4-2.1V18.1c0-1.2-1.3-3-2.5-3.1-4.4-.4-8.8.5-12 3z"
          fill="#F4EBDD"
        />
        <path
          d="M32 20.5c1.8-1.4 4.7-2.9 8.3-2.9h.5v23.5c-3.5-.2-6.6.8-8.8 2.2V20.5z"
          fill="#C9A961"
        />
      </svg>
    </span>
  ) : (
    <img
      src="/logo.png"
      alt={`${site.name} logo`}
      className="brand-mark"
      onError={() => setFailed(true)}
    />
  )
}

export function Logo({ to = '/', onClick }) {
  return (
    <Link to={to} className="brand" onClick={onClick} aria-label={`${site.name}, home`}>
      <LogoMark />
      <span className="brand-text">
        <span className="brand-name">{site.name}</span>
        {site.motto && <span className="brand-sub">{site.motto}</span>}
      </span>
    </Link>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="container header__inner">
          <Logo />

          <div className="header__actions">
            <Link to="/classes" className="btn btn--primary btn--sm header__cta">
              Join a Class
            </Link>
            <button
              type="button"
              className="header__burger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <FontAwesomeIcon icon={menuOpen ? icons.xmark : icons.bars} />
            </button>
          </div>

          <nav className="header__nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            <motion.nav
              className="mobile-menu__nav"
              aria-label="Mobile navigation"
              initial={reduced ? false : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: 'easeOut' }}
            >
              {navLinks.map((link) => (
                <motion.span key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`
                    }
                    end={link.to === '/'}
                  >
                    {link.label}
                  </NavLink>
                </motion.span>
              ))}
              <div className="mobile-menu__cta">
                <Link to="/classes" className="btn btn--lime" onClick={() => setMenuOpen(false)}>
                  Explore Classes
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}