import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Header from './components/Header'
import Footer from './components/Footer'
import { icons } from './components/icons'
import { WA_BASE } from './data/content'
import Home from './pages/Home'
import About from './pages/About'
import Classes from './pages/Classes'
import Lectures from './pages/Lectures'
import Homeschooling, { HomeschoolingArticleDetail } from './pages/Homeschooling'
import Testimonials from './pages/Testimonials'
import Contact from './pages/Contact'
import Hijaamah from './pages/Hijaamah'

export default function App() {
  const location = useLocation()

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/homeschooling" element={<Homeschooling />} />
          <Route path="/homeschooling/:slug" element={<HomeschoolingArticleDetail />} />
          <Route path="/hijaamah" element={<Hijaamah />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
      <a
        href={WA_BASE}
        className="whatsapp-float"
        aria-label="Chat with Ar-Riyaadh Academy on WhatsApp"
        rel="noreferrer"
        target="_blank"
      >
        <FontAwesomeIcon icon={icons.brandWhatsapp} />
        <span className="whatsapp-float__label">Chat with us</span>
      </a>
      <Footer />
    </>
  )
}