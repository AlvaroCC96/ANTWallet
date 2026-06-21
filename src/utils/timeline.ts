import { Bug, Swords, Landmark, Skull, Target, Trophy } from 'lucide-react'
import type { AppData } from '../types/models'
import type { TimelineEvent } from '../types/rpg'
import { formatCLP } from './currency'
import { getCategory } from '../data/categories'
import { calculateAchievements } from './achievements'

export function buildFinancialTimeline(data: AppData): TimelineEvent[] {
  const events: TimelineEvent[] = []

  for (const expense of data.expenses) {
    const category = getCategory(expense.category)
    events.push({
      id: `expense-${expense.id}`,
      icon: category?.icon ?? Bug,
      message: `Gasto registrado: ${expense.name} (${formatCLP(expense.amount)})`,
      date: expense.createdAt,
    })
  }

  for (const payment of data.payments) {
    const debt = data.debts.find((d) => d.id === payment.debtId)
    events.push({
      id: `payment-${payment.id}`,
      icon: Swords,
      message: `Pago de deuda: ${debt?.name ?? 'Deuda'} (${formatCLP(payment.amount)})`,
      date: payment.createdAt,
    })
  }

  for (const account of data.accounts) {
    events.push({
      id: `account-${account.id}`,
      icon: Landmark,
      message: `Activo agregado: ${account.accountName} (${formatCLP(account.balance)})`,
      date: account.createdAt,
    })
  }

  for (const debt of data.debts) {
    events.push({
      id: `debt-${debt.id}`,
      icon: Skull,
      message: `Jefe creado: ${debt.name}`,
      date: debt.createdAt,
    })
  }

  for (const goal of data.goals) {
    events.push({
      id: `goal-${goal.id}`,
      icon: Target,
      message: `Meta creada: ${goal.title}`,
      date: goal.createdAt,
    })
    if (goal.completedAt) {
      events.push({
        id: `goal-done-${goal.id}`,
        icon: Trophy,
        message: `Meta completada: ${goal.title}`,
        date: goal.completedAt,
      })
    }
  }

  if (data.unlockedAchievements.length > 0) {
    const achievements = calculateAchievements(data)
    for (const unlocked of data.unlockedAchievements) {
      const achievement = achievements.find((a) => a.id === unlocked.id)
      if (!achievement) continue
      events.push({
        id: `achievement-${unlocked.id}`,
        icon: Trophy,
        message: `Logro desbloqueado: ${achievement.title}`,
        date: unlocked.unlockedAt,
      })
    }
  }

  return events.sort((a, b) => b.date.localeCompare(a.date))
}
