import { Reveal } from './motion'

export default function SectionHeading({ eyebrow, title, lede, align = 'center' }) {
  const isLeft = align === 'left'
  return (
    <Reveal as="div" className={`section-head ${isLeft ? 'section-head--left' : ''}`}>
      {eyebrow && <span className={`eyebrow ${isLeft ? '' : 'eyebrow--center'}`}>{eyebrow}</span>}
      <h2>{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </Reveal>
  )
}