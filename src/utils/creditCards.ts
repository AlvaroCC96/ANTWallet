import type { Debt } from '../types/models'

export interface CreditCardSummary {
  totalLimit: number
  totalUsed: number
  totalAvailable: number
  utilization: number
  cards: Debt[]
}

export function getCreditCardSummary(debts: Debt[]): CreditCardSummary {
  const cards = debts.filter((d) => d.isCreditCard)
  const totalLimit = cards.reduce((sum, c) => sum + c.totalAmount, 0)
  const totalUsed = cards.reduce((sum, c) => sum + c.remainingAmount, 0)
  const totalAvailable = Math.max(0, totalLimit - totalUsed)
  const utilization = totalLimit > 0 ? Math.min(100, (totalUsed / totalLimit) * 100) : 0

  return { totalLimit, totalUsed, totalAvailable, utilization, cards }
}
