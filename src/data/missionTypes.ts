import { Shield, Plane, Swords, PiggyBank, Target, type LucideIcon } from 'lucide-react'
import type { GoalType } from '../types/rpg'

export interface MissionTypeOption {
  value: GoalType
  label: string
  icon: string
  Icon: LucideIcon
}

export const MISSION_TYPES: MissionTypeOption[] = [
  { value: 'emergency_fund', label: 'Fondo de emergencia', icon: 'Shield', Icon: Shield },
  { value: 'travel', label: 'Viaje', icon: 'Plane', Icon: Plane },
  { value: 'debt_free', label: 'Salir de deudas', icon: 'Swords', Icon: Swords },
  { value: 'savings', label: 'Ahorro / Inversión', icon: 'PiggyBank', Icon: PiggyBank },
  { value: 'custom', label: 'Personalizada', icon: 'Target', Icon: Target },
]

export function getMissionType(type: GoalType): MissionTypeOption {
  return MISSION_TYPES.find((t) => t.value === type) ?? MISSION_TYPES[MISSION_TYPES.length - 1]
}
