import { motion } from 'framer-motion'
import { formatCLP } from '../../utils/currency'

export function FloatingDamage({ amount }: { amount: number }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.9 }}
      animate={{ opacity: 0, y: -36, scale: 1.1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="absolute -top-2 right-3 text-danger font-bold text-sm pointer-events-none drop-shadow"
    >
      -{formatCLP(amount)} HP
    </motion.div>
  )
}
