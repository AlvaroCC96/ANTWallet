import type { AppData } from '../types/models'
import type { AIEventType, AIWatcherState } from '../types/ai'
import { getQueenAnt, netWorth, totalAntExpensesThisMonth } from './calculations'
import { calculateUserXP, getLevelInfo } from './rpg'
import { NET_WORTH_MILESTONES, ANT_WARNING_THRESHOLD } from '../data/aiEvents'

export interface DetectedAIEvent {
  type: AIEventType
  statePatch: Partial<AIWatcherState>
}

/**
 * Returns at most one newly-detected event per call. The watcher persists the
 * state patch immediately, so the next detection cycle naturally picks up the
 * next pending event instead of firing several OpenAI calls at once.
 */
export function detectNextAIEvent(data: AppData): DetectedAIEvent | null {
  const watcher = data.aiWatcherState

  const { level } = getLevelInfo(calculateUserXP(data))
  if (level > watcher.lastLevel) {
    return { type: 'LEVEL_UP', statePatch: { lastLevel: level } }
  }

  const newlyDefeatedBoss = data.debts.find(
    (d) => d.totalAmount > 0 && d.remainingAmount <= 0 && !watcher.celebratedBossIds.includes(d.id),
  )
  if (newlyDefeatedBoss) {
    return {
      type: 'BOSS_DEFEATED',
      statePatch: { celebratedBossIds: [...watcher.celebratedBossIds, newlyDefeatedBoss.id] },
    }
  }

  // Only fires when the throne actually changes hands — the very first queen
  // ever crowned (lastQueenCategory still null) is tracked silently elsewhere.
  const queen = getQueenAnt(data.expenses)
  const queenCategory = queen?.categoryId ?? null
  if (queenCategory && watcher.lastQueenCategory && queenCategory !== watcher.lastQueenCategory) {
    return { type: 'QUEEN_CHANGED', statePatch: { lastQueenCategory: queenCategory } }
  }

  const newlyCompletedGoal = data.goals.find((g) => g.completedAt && !watcher.celebratedGoalIds.includes(g.id))
  if (newlyCompletedGoal) {
    return {
      type: 'GOAL_COMPLETED',
      statePatch: { celebratedGoalIds: [...watcher.celebratedGoalIds, newlyCompletedGoal.id] },
    }
  }

  const net = netWorth(data.accounts, data.debts)
  if (net > 0 && !watcher.netWorthPositiveCelebrated) {
    return { type: 'NET_WORTH_POSITIVE', statePatch: { netWorthPositiveCelebrated: true } }
  }

  const newMilestone = [...NET_WORTH_MILESTONES]
    .reverse()
    .find((m) => net >= m && !watcher.netWorthMilestonesHit.includes(m))
  if (newMilestone) {
    return {
      type: 'NET_WORTH_MILESTONE',
      statePatch: { netWorthMilestonesHit: [...watcher.netWorthMilestonesHit, newMilestone] },
    }
  }

  const spentThisMonth = totalAntExpensesThisMonth(data.expenses)
  const monthKey = new Date().toISOString().slice(0, 7)
  if (
    data.settings.monthlyAntBudget > 0 &&
    spentThisMonth >= data.settings.monthlyAntBudget * ANT_WARNING_THRESHOLD &&
    watcher.antWarningMonth !== monthKey
  ) {
    return { type: 'ANT_WARNING', statePatch: { antWarningMonth: monthKey } }
  }

  return null
}

/**
 * Tracking-only sync (no AI call, no toast): establishes a baseline the first
 * time a queen exists so QUEEN_CHANGED only fires on a genuine handover later.
 */
export function detectSilentAIBaselineSync(data: AppData): Partial<AIWatcherState> | null {
  const queen = getQueenAnt(data.expenses)
  const queenCategory = queen?.categoryId ?? null
  if (queenCategory && !data.aiWatcherState.lastQueenCategory) {
    return { lastQueenCategory: queenCategory }
  }
  return null
}
