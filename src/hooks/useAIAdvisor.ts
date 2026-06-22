import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { buildFinancialSnapshot } from '../utils/snapshot'
import { generateFinancialInsight } from '../lib/aiAdvisor'
import type { AIInsight } from '../types/ai'

export function useAIAdvisor() {
  const { data, addAIInsight, clearAIInsights } = useApp()
  const [loading, setLoading] = useState(false)

  async function generateInsight(eventType?: string): Promise<AIInsight> {
    setLoading(true)
    try {
      const snapshot = buildFinancialSnapshot(data)
      const insight = await generateFinancialInsight(snapshot, eventType)
      addAIInsight(insight)
      return insight
    } finally {
      setLoading(false)
    }
  }

  return {
    insights: data.aiInsights,
    loading,
    generateInsight,
    clearHistory: clearAIInsights,
  }
}
