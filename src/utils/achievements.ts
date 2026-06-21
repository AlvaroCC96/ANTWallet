import { Bug, Skull, Swords, Trophy, Crown, TrendingUp, Landmark, ShieldCheck, Flame, Target, Rocket, Award, type LucideIcon } from 'lucide-react'
import type { AppData } from '../types/models'
import { getQueenAnt, netWorth, totalAntExpensesThisMonth, totalAssets } from './calculations'
import { calculateUserXP, getLevelInfo } from './rpg'

export interface Achievement {
  id: string
  icon: LucideIcon
  title: string
  description: string
  unlocked: boolean
  xpReward?: number
}

const ASSETS_MILESTONE = 1_000_000
const PAYMENTS_MILESTONE = 5
const LEVEL_MILESTONE = 10

export function calculateAchievements(data: AppData): Achievement[] {
  const spentThisMonth = totalAntExpensesThisMonth(data.expenses)
  const bossDefeated = data.debts.some((d) => d.totalAmount > 0 && d.remainingAmount <= 0)
  const { level } = getLevelInfo(calculateUserXP(data))

  return [
    {
      id: 'first-expense',
      icon: Bug,
      title: 'Primer gasto registrado',
      description: 'Registraste tu primer gasto hormiga.',
      unlocked: data.expenses.length > 0,
    },
    {
      id: 'first-debt',
      icon: Skull,
      title: 'Primer jefe creado',
      description: 'Agregaste tu primera deuda al campo de batalla.',
      unlocked: data.debts.length > 0,
    },
    {
      id: 'first-payment',
      icon: Swords,
      title: 'Primer golpe a un jefe',
      description: 'Registraste tu primer pago de deuda.',
      unlocked: data.payments.length > 0,
    },
    {
      id: 'first-boss-defeated',
      icon: Trophy,
      title: 'Primer jefe derrotado',
      description: 'Saldaste una deuda por completo.',
      unlocked: bossDefeated,
    },
    {
      id: 'first-queen',
      icon: Crown,
      title: 'Descubriste tu primera Reina Hormiga',
      description: 'Identificaste tu categoría de gasto más fuerte del mes.',
      unlocked: getQueenAnt(data.expenses) !== null,
    },
    {
      id: 'positive-net-worth',
      icon: TrendingUp,
      title: 'Patrimonio neto positivo',
      description: 'Tus activos superan a tus deudas.',
      unlocked: netWorth(data.accounts, data.debts) > 0,
    },
    {
      id: 'assets-over-million',
      icon: Landmark,
      title: 'Más de $1.000.000 en activos',
      description: 'Acumulaste más de un millón en tus cuentas.',
      unlocked: totalAssets(data.accounts) >= ASSETS_MILESTONE,
    },
    {
      id: 'month-under-control',
      icon: ShieldCheck,
      title: 'Gastos hormiga bajo control',
      description: 'Gastaste menos del 50% de tu presupuesto mensual.',
      unlocked: spentThisMonth > 0 && spentThisMonth < data.settings.monthlyAntBudget * 0.5,
    },
    {
      id: 'five-payments',
      icon: Flame,
      title: '5 pagos de deuda registrados',
      description: 'Ya llevas 5 ataques registrados contra tus jefes de deuda.',
      unlocked: data.payments.length >= PAYMENTS_MILESTONE,
    },
    {
      id: 'first-goal',
      icon: Target,
      title: 'Primera meta creada',
      description: 'Definiste tu primera misión financiera.',
      unlocked: data.goals.length > 0,
    },
    {
      id: 'first-goal-completed',
      icon: Rocket,
      title: 'Primera meta completada',
      description: 'Completaste una misión financiera.',
      unlocked: data.goals.some((g) => Boolean(g.completedAt)),
      xpReward: 150,
    },
    {
      id: 'level-10',
      icon: Award,
      title: 'Nivel 10 alcanzado',
      description: 'Tu experiencia financiera llegó a nivel 10.',
      unlocked: level >= LEVEL_MILESTONE,
    },
  ]
}
