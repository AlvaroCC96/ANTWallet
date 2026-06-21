import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

export function AchievementToast({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50 }}
      className="bg-card border border-yellow-500/50 text-ink px-4 py-3 rounded-xl shadow-lg max-w-xs flex items-center gap-3"
    >
      <span className="text-yellow-600 bg-yellow-500/10 rounded-lg p-2 shrink-0">
        <Trophy size={20} />
      </span>
      <div>
        <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Logro desbloqueado</p>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
    </motion.div>
  )
}
