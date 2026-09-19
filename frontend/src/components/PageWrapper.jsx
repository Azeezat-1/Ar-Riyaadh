import { motion } from 'framer-motion'
import { pageVariants } from './motion'

export default function PageWrapper({ children }) {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.main>
  )
}