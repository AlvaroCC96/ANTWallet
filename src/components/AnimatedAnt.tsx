import { motion } from 'framer-motion'
import { Bug } from 'lucide-react'

export function AnimatedAnt() {
  return (
    <motion.div
      initial={{ x: '-10vw' }}
      animate={{ x: '110vw' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: 'linear' }}
      className="absolute text-accent-light"
    >
      <Bug size={32} />
    </motion.div>
  )
}
