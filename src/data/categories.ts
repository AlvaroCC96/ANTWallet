import {
  Coffee,
  Bike,
  Gamepad2,
  ShoppingCart,
  Heart,
  Goal,
  Plane,
  Car,
  Code2,
  Repeat,
  Receipt,
  type LucideIcon,
} from 'lucide-react'

export interface ExpenseCategory {
  id: string
  icon: LucideIcon
  label: string
}

export const CATEGORIES: ExpenseCategory[] = [
  { id: 'cafe-snacks', icon: Coffee, label: 'Café y Snacks' },
  { id: 'delivery', icon: Bike, label: 'Delivery' },
  { id: 'gaming', icon: Gamepad2, label: 'Gaming' },
  { id: 'compras-impulsivas', icon: ShoppingCart, label: 'Compras Impulsivas' },
  { id: 'salidas-pamela', icon: Heart, label: 'Salidas / Pamela' },
  { id: 'cobreloa', icon: Goal, label: 'Cobreloa' },
  { id: 'viajes', icon: Plane, label: 'Viajes' },
  { id: 'auto-groove', icon: Car, label: 'Auto / Groove' },
  { id: 'developer', icon: Code2, label: 'Developer' },
  { id: 'suscripciones', icon: Repeat, label: 'Suscripciones' },
  { id: 'servicios-basicos', icon: Receipt, label: 'Servicios Básicos' },
]

export function getCategory(id: string): ExpenseCategory | undefined {
  return CATEGORIES.find((c) => c.id === id)
}
