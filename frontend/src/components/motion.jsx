import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

export const fadeUp = (reduced) => ({
  hidden: { opacity: 0, y: reduced ? 0 : 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
})

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export function Reveal({ children, as = 'div', ...rest }) {
  const reduced = useReducedMotion()
  const variants = useMemo(() => fadeUp(reduced), [reduced])
  const motionProps = {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-60px' },
    variants,
  }
  if (as === 'h2') return <motion.h2 {...motionProps} {...rest}>{children}</motion.h2>
  if (as === 'p') return <motion.p {...motionProps} {...rest}>{children}</motion.p>
  if (as === 'span') return <motion.span {...motionProps} {...rest}>{children}</motion.span>
  return <motion.div {...motionProps} {...rest}>{children}</motion.div>
}

export function StaggerGroup({ children, className }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={stagger}
    >
      {children}
    </motion.div>
  )
}

export const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
}