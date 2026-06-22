import { useEffect, useRef } from 'react'
import { useApp } from '../../store/AppContext'
import { useFx } from '../../store/FxContext'
import { useAIAdvisor } from '../../hooks/useAIAdvisor'
import { detectNextAIEvent, detectSilentAIBaselineSync } from '../../utils/aiEventDetector'
import { AI_EVENT_LABELS, AI_INSIGHT_ICON } from '../../data/aiEvents'
import type { AIEventType } from '../../types/ai'

/** Renders nothing — watches for game milestones and asks AntAI to react to them. */
export function AIEventWatcher() {
  const { data, loading, updateAIWatcherState } = useApp()
  const { showToast } = useFx()
  const { generateInsight } = useAIAdvisor()
  const processingRef = useRef(false)

  useEffect(() => {
    if (loading || processingRef.current) return

    const silentSync = detectSilentAIBaselineSync(data)
    if (silentSync) {
      updateAIWatcherState(silentSync)
      return
    }

    const event = detectNextAIEvent(data)
    if (!event) return

    processingRef.current = true
    void (async () => {
      try {
        const insight = await generateInsight(event.type)
        showToast(`${AI_EVENT_LABELS[event.type as AIEventType]}: ${insight.title}`, AI_INSIGHT_ICON[insight.type])
      } finally {
        updateAIWatcherState(event.statePatch)
        processingRef.current = false
      }
    })()
  }, [data, loading, generateInsight, showToast, updateAIWatcherState])

  return null
}
