import type { AppData, Debt, DebtPayment } from '../types/models'
import type { FinancialTitleResult, LevelInfo } from '../types/rpg'
import { netWorth, totalAntExpensesThisMonth } from './calculations'

export const XP_PER_LEVEL = 250

export const XP_RULES = {
  createAccount: 20,
  positiveBalanceBonus: 15,
  smallExpense: 1,
  mediumExpense: 0,
  largeExpensePenalty: -10,
  createDebt: 5,
  debtPayment: 30,
  aboveMinimumPaymentBonus: 50,
  debtDefeated: 200,
  positiveNetWorth: 100,
  antBudgetUnderControl: 150,
  goalCompleted: 150,
} as const

const SMALL_EXPENSE_LIMIT = 5000
const MEDIUM_EXPENSE_LIMIT = 20000

export function getExpenseXP(amount: number): number {
  if (amount < SMALL_EXPENSE_LIMIT) return XP_RULES.smallExpense
  if (amount < MEDIUM_EXPENSE_LIMIT) return XP_RULES.mediumExpense
  return XP_RULES.largeExpensePenalty
}

export function getPaymentXP(payment: DebtPayment, debt: Debt | undefined): number {
  let xp: number = XP_RULES.debtPayment
  if (debt && payment.amount > debt.minimumPayment) xp += XP_RULES.aboveMinimumPaymentBonus
  return xp
}

export function calculateUserXP(data: AppData): number {
  let xp = 0

  xp += data.accounts.length * XP_RULES.createAccount
  xp += data.accounts.filter((a) => a.balance > 0).length * XP_RULES.positiveBalanceBonus

  xp += data.expenses.reduce((sum, e) => sum + getExpenseXP(e.amount), 0)

  xp += data.debts.length * XP_RULES.createDebt
  xp += data.debts.filter((d) => d.totalAmount > 0 && d.remainingAmount <= 0).length * XP_RULES.debtDefeated

  for (const payment of data.payments) {
    const debt = data.debts.find((d) => d.id === payment.debtId)
    xp += getPaymentXP(payment, debt)
  }

  if (netWorth(data.accounts, data.debts) > 0) xp += XP_RULES.positiveNetWorth

  const spentThisMonth = totalAntExpensesThisMonth(data.expenses)
  if (spentThisMonth > 0 && spentThisMonth < data.settings.monthlyAntBudget * 0.5) {
    xp += XP_RULES.antBudgetUnderControl
  }

  xp += data.goals.filter((g) => g.completedAt).length * XP_RULES.goalCompleted

  return xp
}

export function getLevelInfo(totalXPRaw: number): LevelInfo {
  const totalXP = Math.max(0, totalXPRaw)
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1
  const currentLevelXP = totalXP % XP_PER_LEVEL

  return {
    level,
    currentLevelXP,
    nextLevelXP: XP_PER_LEVEL,
    progress: currentLevelXP / XP_PER_LEVEL,
    totalXP,
  }
}

export function getFinancialTitle(
  level: number,
  netWorthValue: number,
  totalDebtValue: number,
  monthlyAntExpenses: number,
  monthlyAntBudget: number,
): FinancialTitleResult {
  if (netWorthValue < 0) return { emoji: '💀', label: 'Sobreviviente Financiero' }
  if (monthlyAntExpenses > monthlyAntBudget) return { emoji: '🐜', label: 'Invadido por la Colonia' }
  if (totalDebtValue <= 0) return { emoji: '🏆', label: 'Libre de Jefes' }

  if (level <= 3) return { emoji: '🪙', label: 'Novato Financiero' }
  if (level <= 7) return { emoji: '🐜', label: 'Cazador de Hormigas' }
  if (level <= 12) return { emoji: '🛡️', label: 'Defensor de Billetera' }
  if (level <= 20) return { emoji: '⚔️', label: 'Guerrero Anti-Deuda' }
  return { emoji: '👑', label: 'Rey del Patrimonio' }
}
