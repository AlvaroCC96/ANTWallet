import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { getQueenAnt, getQueenAntPhrase } from '../utils/calculations'
import type { AntExpense } from '../types/models'

export function QueenAnt({ expenses }: { expenses: AntExpense[] }) {
  const queen = getQueenAnt(expenses)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-deep-magenta/50 to-card border border-deep-violet/50 rounded-2xl p-5"
    >
      <h3 className="text-lg font-semibold text-ink flex items-center gap-2 mb-2">
        <Crown size={20} className="text-yellow-500" /> Reina Hormiga del mes
      </h3>
      {queen ? (
        <div className="flex items-center gap-3">
          <span className="text-yellow-600 bg-card-alt rounded-lg p-2.5">
            <queen.icon size={28} />
          </span>
          <p className="text-sm text-ink-soft">{getQueenAntPhrase(queen)}</p>
        </div>
      ) : (
        <p className="text-sm text-muted">Aún no hay una reina este mes. ¡Registra tu primer gasto!</p>
      )}
    </motion.div>
  )
}
