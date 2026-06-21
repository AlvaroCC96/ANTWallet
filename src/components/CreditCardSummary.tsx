import { motion } from 'framer-motion'
import { CreditCard } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { getCreditCardSummary } from '../utils/creditCards'
import { formatCLP } from '../utils/currency'

export function CreditCardSummary() {
  const { data } = useApp()
  const summary = getCreditCardSummary(data.debts)

  if (summary.cards.length === 0) return null

  const barColor = summary.utilization >= 80 ? 'bg-danger' : summary.utilization >= 50 ? 'bg-warning' : 'bg-wealth'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-deep-darker/60 rounded-2xl p-5 space-y-3"
    >
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <CreditCard size={20} className="text-accent-light" /> Cupo de tarjetas de crédito
      </h3>
      <p className="text-xs text-gray-500">
        No forma parte de tu patrimonio neto — es la capacidad de crédito disponible en tus {summary.cards.length}{' '}
        tarjeta{summary.cards.length === 1 ? '' : 's'}.
      </p>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-gray-400">Cupo total</p>
          <p className="text-sm font-bold text-white">{formatCLP(summary.totalLimit)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Usado</p>
          <p className="text-sm font-bold text-orange-400">{formatCLP(summary.totalUsed)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Disponible</p>
          <p className="text-sm font-bold text-wealth">{formatCLP(summary.totalAvailable)}</p>
        </div>
      </div>

      <div className="h-3 bg-black/40 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${summary.utilization}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-gray-500">{summary.utilization.toFixed(0)}% del cupo total en uso</p>
    </motion.div>
  )
}
