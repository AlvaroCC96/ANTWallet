import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, History, ChevronDown } from 'lucide-react'
import { useAIAdvisor } from '../../hooks/useAIAdvisor'
import { AI_EVENT_LABELS, AI_INSIGHT_ICON } from '../../data/aiEvents'
import { formatRelativeTime } from '../../utils/dates'
import type { AIEventType } from '../../types/ai'
import { AIInsightHistory } from './AIInsightHistory'

const TYPE_BADGE: Record<string, string> = {
  warning: 'text-warning bg-warning/10 border-warning/30',
  success: 'text-wealth bg-wealth/10 border-wealth/30',
  achievement: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30',
  motivation: 'text-accent-light bg-accent/10 border-accent-soft/40',
  strategy: 'text-accent-light bg-accent/10 border-accent-soft/40',
}

export function AIAdvisorCard() {
  const { insights, loading, generateInsight, clearHistory } = useAIAdvisor()
  const [showHistory, setShowHistory] = useState(false)

  const latest = insights[0]
  const Icon = latest ? AI_INSIGHT_ICON[latest.type] : Brain

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-deep-violet/30 via-card to-card border border-accent-soft/50 rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
          <Brain size={20} className="text-accent-light" /> AntAI Advisor
        </h3>
        <button
          onClick={() => setShowHistory((s) => !s)}
          className="text-muted hover:text-accent-light flex items-center gap-1 text-xs"
        >
          <History size={14} /> Historial
          <ChevronDown size={14} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-accent-light flex items-center gap-2">
              <Brain size={16} className="animate-pulse" /> AntAI está analizando el reino financiero...
            </p>
            <div className="h-3 w-3/4 rounded bg-card-alt animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-card-alt animate-pulse" />
          </motion.div>
        ) : latest ? (
          <motion.div
            key={latest.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border p-4 space-y-2 ${TYPE_BADGE[latest.type] ?? TYPE_BADGE.motivation}`}
          >
            <p className="font-semibold flex items-center gap-2">
              <Icon size={18} /> {latest.title}
            </p>
            <p className="text-sm text-ink-soft">{latest.message}</p>
            <div className="flex items-center justify-between text-xs text-muted pt-1">
              <span>{formatRelativeTime(latest.generatedAt)}</span>
              {latest.triggerEvent && (
                <span>Evento: {AI_EVENT_LABELS[latest.triggerEvent as AIEventType] ?? latest.triggerEvent}</span>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted">
            Tu consejero aún no se ha pronunciado. Pídele un consejo o sigue jugando: AntAI reaccionará solo a tus
            hitos importantes.
          </motion.p>
        )}
      </AnimatePresence>

      <button
        onClick={() => generateInsight()}
        disabled={loading}
        className="w-full bg-accent hover:bg-accent-light disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Brain size={16} /> Generar Consejo IA
      </button>

      <AnimatePresence>
        {showHistory && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <AIInsightHistory insights={insights} onClear={clearHistory} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
