import type { LucideIcon } from 'lucide-react'
import type { Account, AntExpense, Debt } from '../types/models'
import { getCategory } from '../data/categories'
import { isSameMonth } from './dates'

export function totalAssets(accounts: Account[]): number {
  return accounts.reduce((sum, a) => sum + a.balance, 0)
}

export function totalDebts(debts: Debt[]): number {
  return debts.reduce((sum, d) => sum + d.remainingAmount, 0)
}

export function netWorth(accounts: Account[], debts: Debt[]): number {
  return totalAssets(accounts) - totalDebts(debts)
}

export function monthlyAntExpenses(expenses: AntExpense[], reference: Date = new Date()): AntExpense[] {
  return expenses.filter((e) => isSameMonth(e.date, reference))
}

export function totalAntExpensesThisMonth(expenses: AntExpense[], reference: Date = new Date()): number {
  return monthlyAntExpenses(expenses, reference).reduce((sum, e) => sum + e.amount, 0)
}

export interface QueenAnt {
  categoryId: string
  icon: LucideIcon
  label: string
  total: number
}

const QUEEN_PHRASES: Record<string, string> = {
  'cafe-snacks': 'La Reina Hormiga se tomó todo el presupuesto en cafecitos.',
  'delivery': 'Ese ejército venía con papas fritas.',
  'gaming': 'La Reina Hormiga subió de nivel, tu billetera no.',
  'compras-impulsivas': 'Compró todo el hormiguero sin preguntar.',
  'salidas-pamela': 'El amor cuesta caro, pero vale la pena.',
  'cobreloa': 'La pasión nortina golpeó fuerte la billetera.',
  'viajes': 'La colonia se fue de vacaciones sin avisar.',
  'auto-groove': 'El auto pidió su propio sueldo este mes.',
  'developer': 'Invirtió en hardware "para ser más productivo".',
  'suscripciones': 'Mil hormigas pequeñas cobrando cada mes.',
  'servicios-basicos': 'La luz, el agua y el gas también tienen su propio ejército.',
}

export function getQueenAnt(expenses: AntExpense[], reference: Date = new Date()): QueenAnt | null {
  const monthly = monthlyAntExpenses(expenses, reference)
  if (monthly.length === 0) return null

  const totals = new Map<string, number>()
  for (const e of monthly) {
    totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount)
  }

  let topCategory = ''
  let topTotal = 0
  for (const [cat, total] of totals) {
    if (total > topTotal) {
      topTotal = total
      topCategory = cat
    }
  }

  const category = getCategory(topCategory)
  if (!category) return null

  return {
    categoryId: topCategory,
    icon: category.icon,
    label: category.label,
    total: topTotal,
  }
}

export function getQueenAntPhrase(queen: QueenAnt): string {
  const phrase = QUEEN_PHRASES[queen.categoryId] ?? 'Ese ejército venía bien preparado.'
  return `La Reina Hormiga del mes es ${queen.label} con ${queen.total.toLocaleString('es-CL')}. ${phrase}`
}

export interface WalletHealth {
  life: number
  status: 'healthy' | 'alert' | 'danger'
}

export function getWalletHealth(spent: number, budget: number): WalletHealth {
  const life = Math.max(0, Math.min(100, 100 - (spent / budget) * 100))
  const status: WalletHealth['status'] = life >= 70 ? 'healthy' : life >= 40 ? 'alert' : 'danger'
  return { life, status }
}

export function getAntColonySize(spent: number, perAnt = 10000, max = 30): number {
  return Math.min(max, Math.floor(spent / perAnt))
}

export function debtLife(debt: Debt): number {
  if (debt.totalAmount <= 0) return 0
  return Math.max(0, Math.min(100, (debt.remainingAmount / debt.totalAmount) * 100))
}

export function getMainBossDebt(debts: Debt[]): Debt | null {
  const active = debts.filter((d) => d.remainingAmount > 0)
  if (active.length === 0) return null
  return active.reduce((biggest, d) => (d.remainingAmount > biggest.remainingAmount ? d : biggest))
}
