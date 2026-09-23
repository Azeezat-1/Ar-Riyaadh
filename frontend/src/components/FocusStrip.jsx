import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { Reveal } from './motion'
import './blocks.css'

const FOCUS_ITEMS = [
  { icon: 'book-quran', label: 'Qur\u02bc\u0101n & Tajweed' },
  { icon: 'language', label: 'Arabic, Tafsir & Hadith' },
  { icon: 'droplet', label: 'Hijaamah instruction' },
  { icon: 'microphone-lines', label: 'Friday & Sunday Lectures' },
]

export default function FocusStrip() {
  return (
    <section className="focus-strip" aria-label="What Ar-Riyaadh Academy offers">
      <div className="container">
        <Reveal as="div" className="focus-strip__grid">
          {FOCUS_ITEMS.map((item) => (
            <div className="focus-item" key={item.label}>
              <span className="focus-item__icon">
                <FontAwesomeIcon icon={icons[item.icon]} aria-hidden="true" />
              </span>
              <span className="focus-item__label">{item.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}