import { motion } from 'framer-motion'
import { History } from 'lucide-react'
import { useApp } from '../../store/AppContext'
import { buildFinancialTimeline } from '../../utils/timeline'
import { formatDate } from '../../utils/dates'

export function FinancialTimeline() {
  const { data } = useApp()
  const events = buildFinancialTimeline(data).slice(0, 20)

  return (
    <div className="bg-card border border-deep-darker/60 rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-ink flex items-center gap-2 mb-3">
        <History size={20} className="text-accent-light" /> Línea de tiempo financiera
      </h3>
      {events.length === 0 ? (
        <p className="text-muted text-sm">Aún no hay actividad registrada.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-3 bg-card-alt border border-deep-darker/40 rounded-lg px-3 py-2"
            >
              <event.icon size={16} className="text-accent-light shrink-0" />
              <p className="text-sm text-ink-soft flex-1">{event.message}</p>
              <span className="text-xs text-muted whitespace-nowrap">{formatDate(event.date)}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
