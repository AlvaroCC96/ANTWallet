import { motion } from 'framer-motion'
import { useAuth } from '../../store/AuthContext'
import { useApp } from '../../store/AppContext'
import { netWorth, totalAntExpensesThisMonth, totalDebts, getWalletHealth } from '../../utils/calculations'
import { calculateUserXP, getLevelInfo, getFinancialTitle } from '../../utils/rpg'
import { formatCLP } from '../../utils/currency'
import { LevelProgress } from './LevelProgress'

function fallbackName(email: string | null | undefined): string {
  if (!email) return 'Jugador'
  const local = email.split('@')[0]
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const WALLET_STATUS_LABEL: Record<string, string> = {
  healthy: '💪 Billetera saludable',
  alert: '⚠️ Billetera en alerta',
  danger: '🚨 Billetera en peligro',
}

export function RPGProfileCard() {
  const { user, displayName } = useAuth()
  const { data } = useApp()

  const net = netWorth(data.accounts, data.debts)
  const debts = totalDebts(data.debts)
  const spentThisMonth = totalAntExpensesThisMonth(data.expenses)
  const totalXP = calculateUserXP(data)
  const levelInfo = getLevelInfo(totalXP)
  const title = getFinancialTitle(levelInfo.level, net, debts, spentThisMonth, data.settings.monthlyAntBudget)
  const { status } = getWalletHealth(spentThisMonth, data.settings.monthlyAntBudget)

  const name = displayName || fallbackName(user?.email)

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-card to-deep border border-accent-soft/50 rounded-2xl p-6 space-y-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Perfil financiero</p>
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <p className="text-sm text-accent-light font-medium">
            Lv. {levelInfo.level} — {title.emoji} {title.label}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Patrimonio neto</p>
          <p className={`text-xl font-bold ${net >= 0 ? 'text-wealth' : 'text-danger'}`}>{formatCLP(net)}</p>
          <p className="text-xs text-gray-400 mt-1">{WALLET_STATUS_LABEL[status]}</p>
        </div>
      </div>

      <LevelProgress levelInfo={levelInfo} />
    </motion.div>
  )
}
