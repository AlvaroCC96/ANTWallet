import type { FinancialGoal } from '../types/rpg'

export const GOAL_COMPLETION_XP = 150

export function goalProgress(goal: FinancialGoal): number {
  if (goal.targetAmount <= 0) return 0
  return Math.max(0, Math.min(100, (goal.currentAmount / goal.targetAmount) * 100))
}

export function isGoalCompleted(goal: FinancialGoal): boolean {
  return goal.targetAmount > 0 && goal.currentAmount >= goal.targetAmount
}
