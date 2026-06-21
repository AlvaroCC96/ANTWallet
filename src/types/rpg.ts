import type { LucideIcon } from 'lucide-react'

export type GoalType = 'emergency_fund' | 'travel' | 'debt_free' | 'savings' | 'custom'

export interface FinancialGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  type: GoalType
  icon: string
  createdAt: string
  completedAt?: string
}

export interface LevelInfo {
  level: number
  currentLevelXP: number
  nextLevelXP: number
  progress: number
  totalXP: number
}

export interface FinancialTitleResult {
  emoji: string
  label: string
}

export type BossLifeState = 'strong' | 'wounded' | 'critical' | 'defeated'

export interface RpgBossName {
  emoji: string
  name: string
}

export interface TimelineEvent {
  id: string
  icon: LucideIcon
  message: string
  date: string
}

export interface UnlockedAchievement {
  id: string
  unlockedAt: string
}
