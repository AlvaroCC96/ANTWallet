import type { AppData } from '../types/models'
import type { FinancialSnapshot } from '../types/ai'
import {
  debtLife,
  getMainBossDebt,
  getQueenAnt,
  netWorth,
  totalAntExpensesThisMonth,
  totalAssets,
  totalDebts,
} from './calculations'
import { generateDebtBossName } from './bossNames'
import { calculateUserXP, getLevelInfo } from './rpg'

export function buildFinancialSnapshot(data: AppData): FinancialSnapshot {
  const mainBoss = getMainBossDebt(data.debts)
  const queen = getQueenAnt(data.expenses)
  const { level, totalXP } = getLevelInfo(calculateUserXP(data))

  return {
    netWorth: netWorth(data.accounts, data.debts),
    totalAssets: totalAssets(data.accounts),
    totalDebt: totalDebts(data.debts),
    monthlyAntExpenses: totalAntExpensesThisMonth(data.expenses),
    monthlyBudget: data.settings.monthlyAntBudget,
    queenCategory: queen?.label ?? null,
    queenAmount: queen?.total ?? 0,
    mainBossName: mainBoss ? generateDebtBossName(mainBoss).name : null,
    bossHealth: mainBoss ? Math.round(debtLife(mainBoss)) : 0,
    level,
    xp: totalXP,
    completedGoals: data.goals.filter((g) => g.completedAt).length,
    completedBosses: data.debts.filter((d) => d.totalAmount > 0 && d.remainingAmount <= 0).length,
  }
}
