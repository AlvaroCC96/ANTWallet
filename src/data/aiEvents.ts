import { AlertTriangle, Sparkles, Trophy, Heart, Compass, type LucideIcon } from 'lucide-react'
import type { AIEventType, AIInsightType } from '../types/ai'

export const AI_EVENT_LABELS: Record<AIEventType, string> = {
  LEVEL_UP: 'Subida de nivel',
  BOSS_DEFEATED: 'Jefe derrotado',
  QUEEN_CHANGED: 'Cambio de Reina Hormiga',
  GOAL_COMPLETED: 'Meta completada',
  NET_WORTH_POSITIVE: 'Patrimonio neto positivo',
  NET_WORTH_MILESTONE: 'Hito de patrimonio',
  ANT_WARNING: 'Gastos hormiga peligrosos',
}

export const AI_INSIGHT_ICON: Record<AIInsightType, LucideIcon> = {
  warning: AlertTriangle,
  success: Sparkles,
  achievement: Trophy,
  motivation: Heart,
  strategy: Compass,
}

export const NET_WORTH_MILESTONES = [1_000_000, 5_000_000, 10_000_000]
export const ANT_WARNING_THRESHOLD = 0.8
