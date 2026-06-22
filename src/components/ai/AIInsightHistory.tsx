import { Trash2 } from 'lucide-react'
import type { AIInsight, AIEventType } from '../../types/ai'
import { AI_EVENT_LABELS, AI_INSIGHT_ICON } from '../../data/aiEvents'
import { formatRelativeTime } from '../../utils/dates'

export function AIInsightHistory({ insights, onClear }: { insights: AIInsight[]; onClear: () => void }) {
  if (insights.length === 0) {
    return <p className="text-muted text-sm pt-2">Aún no hay historial de consejos.</p>
  }

  return (
    <div className="pt-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted uppercase tracking-wide">Últimos {insights.length} consejos</p>
        <button onClick={onClear} className="text-xs text-muted hover:text-danger flex items-center gap-1">
          <Trash2 size={12} /> Limpiar historial
        </button>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {insights.map((insight) => {
          const Icon = AI_INSIGHT_ICON[insight.type]
          return (
            <div key={insight.id} className="bg-card-alt border border-deep-darker/40 rounded-lg px-3 py-2">
              <p className="text-sm font-medium text-ink flex items-center gap-2">
                <Icon size={14} className="text-accent-light shrink-0" /> {insight.title}
              </p>
              <p className="text-xs text-muted mt-1">{insight.message}</p>
              <div className="flex items-center justify-between text-[11px] text-muted mt-1.5">
                <span>{formatRelativeTime(insight.generatedAt)}</span>
                {insight.triggerEvent && (
                  <span>{AI_EVENT_LABELS[insight.triggerEvent as AIEventType] ?? insight.triggerEvent}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
