import type { Debt } from '../types/models'
import type { BossLifeState, RpgBossName } from '../types/rpg'
import { debtLife } from './calculations'

const INSTITUTION_RULES: { match: RegExp; emoji: string; name: (institution: string) => string }[] = [
  { match: /santander/i, emoji: '👹', name: () => 'El Devorador Santander' },
  { match: /falabella/i, emoji: '🐉', name: () => 'Dragón Falabella' },
  { match: /banco de chile|banco chile/i, emoji: '🏦', name: () => 'Titán Banco Chile' },
]

const NAME_RULES: { match: RegExp; emoji: string; name: string }[] = [
  { match: /tarjeta/i, emoji: '💳', name: 'Bestia del Crédito' },
  { match: /consumo/i, emoji: '🧟', name: 'Coloso del Consumo' },
]

export function generateDebtBossName(debt: Debt): RpgBossName {
  for (const rule of INSTITUTION_RULES) {
    if (rule.match.test(debt.institution)) {
      return { emoji: rule.emoji, name: rule.name(debt.institution) }
    }
  }

  for (const rule of NAME_RULES) {
    if (rule.match.test(debt.name)) {
      return { emoji: rule.emoji, name: rule.name }
    }
  }

  return { emoji: '👺', name: `Demonio de ${debt.institution || debt.name}` }
}

export function getBossLifeState(debt: Debt): BossLifeState {
  if (debt.totalAmount > 0 && debt.remainingAmount <= 0) return 'defeated'
  const life = debtLife(debt)
  if (life >= 70) return 'strong'
  if (life >= 40) return 'wounded'
  return 'critical'
}

export const BOSS_LIFE_STATE_LABEL: Record<BossLifeState, string> = {
  strong: 'Jefe fuerte',
  wounded: 'Jefe herido',
  critical: 'Jefe crítico',
  defeated: 'Jefe derrotado',
}
