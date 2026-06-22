export type AIInsightType = 'warning' | 'success' | 'achievement' | 'motivation' | 'strategy'

export interface AIInsight {
  id: string
  type: AIInsightType
  title: string
  message: string
  generatedAt: string
  triggerEvent?: string
}

export type AIEventType =
  | 'LEVEL_UP'
  | 'BOSS_DEFEATED'
  | 'QUEEN_CHANGED'
  | 'GOAL_COMPLETED'
  | 'NET_WORTH_POSITIVE'
  | 'NET_WORTH_MILESTONE'
  | 'ANT_WARNING'

export interface FinancialSnapshot {
  netWorth: number
  totalAssets: number
  totalDebt: number
  monthlyAntExpenses: number
  monthlyBudget: number
  queenCategory: string | null
  queenAmount: number
  mainBossName: string | null
  bossHealth: number
  level: number
  xp: number
  completedGoals: number
  completedBosses: number
}

/** Tracks what AntAI has already reacted to, so the same event never fires twice. */
export interface AIWatcherState {
  lastLevel: number
  lastQueenCategory: string | null
  celebratedBossIds: string[]
  celebratedGoalIds: string[]
  netWorthPositiveCelebrated: boolean
  netWorthMilestonesHit: number[]
  antWarningMonth: string | null
}
