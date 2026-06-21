import {
  Landmark,
  PiggyBank,
  Banknote,
  TrendingUp,
  Smartphone,
  CreditCard,
  Skull,
  Flame,
  Ghost,
  Swords,
  Shield,
  Plane,
  Target,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'

// Only icons stored as string keys in persisted data (Account.icon / Debt.icon /
// FinancialGoal.icon) belong here. Listing them explicitly keeps lucide-react tree-shakeable.
const registry: Record<string, React.ComponentType<LucideProps>> = {
  Landmark,
  PiggyBank,
  Banknote,
  TrendingUp,
  Smartphone,
  CreditCard,
  Skull,
  Flame,
  Ghost,
  Swords,
  Shield,
  Plane,
  Target,
}

export function getIconComponent(name: string): React.ComponentType<LucideProps> {
  return registry[name] ?? Landmark
}

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = getIconComponent(name)
  return <Component {...props} />
}
