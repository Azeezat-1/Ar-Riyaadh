import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, stagger } from './motion'
import { timeline } from '../data/content'
import './Timeline.css'

export default function Timeline() {
  const reduced = useReducedMotion()
  const item = fadeUp(reduced)

  return (
    <motion.div
      className="timeline"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={stagger}
    >
      {timeline.map((entry, i) => (
        <motion.div className="timeline__row" key={entry.phase} variants={item} custom={i}>
          <span className="timeline__phase">{entry.phase}</span>
          <span className="timeline__dot" aria-hidden="true" />
          <div className="timeline__content">
            <h4 className="timeline__title">{entry.title}</h4>
            <p>{entry.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}