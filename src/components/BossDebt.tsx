import { useState } from 'react'
import { motion } from 'framer-motion'
import { Skull, X, Swords, Trophy } from 'lucide-react'
import type { Debt } from '../types/models'
import { useApp } from '../store/AppContext'
import { useFx } from '../store/FxContext'
import { debtLife } from '../utils/calculations'
import { formatCLP } from '../utils/currency'
import { todayISO } from '../utils/dates'
import { CurrencyInput } from './CurrencyInput'
import { Icon } from './Icon'

const HIT_PHRASES = ['Golpe directo al jefe de deuda', '¡Crítico! El jefe tiembla', 'Buen ataque, sigue así']

export function BossDebt({ debt }: { debt: Debt }) {
  const { addPayment, deleteDebt } = useApp()
  const { showToast, defeatBoss } = useFx()
  const [amount, setAmount] = useState('')
  const [hit, setHit] = useState(false)

  const life = debtLife(debt)
  const defeated = debt.totalAmount > 0 && debt.remainingAmount <= 0
  const barColor = life >= 70 ? 'bg-wealth' : life >= 40 ? 'bg-warning' : 'bg-danger'

  function handlePay(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return

    const { defeated: wasDefeated } = addPayment({ debtId: debt.id, amount: value, date: todayISO() })

    setHit(true)
    setTimeout(() => setHit(false), 400)

    const phrase = HIT_PHRASES[Math.floor(Math.random() * HIT_PHRASES.length)]
    showToast(phrase, Swords)

    if (wasDefeated) {
      defeatBoss({ name: debt.name, icon: debt.icon })
    }

    setAmount('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, x: hit ? [0, -6, 6, -4, 4, 0] : 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-card border rounded-2xl p-5 space-y-3 ${defeated ? 'border-wealth/60' : 'border-deep-darker/60'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`p-2 rounded-lg bg-deep ${defeated ? 'text-gray-400' : 'text-danger'}`}>
            {defeated ? <Skull size={26} /> : <Icon name={debt.icon} size={26} />}
          </span>
          <div>
            <p className="font-bold text-white">{debt.name}</p>
            <p className="text-xs text-gray-400">{debt.institution}</p>
          </div>
        </div>
        <button onClick={() => deleteDebt(debt.id)} className="text-gray-500 hover:text-danger">
          <X size={16} />
        </button>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Vida del jefe</span>
          <span>{formatCLP(debt.remainingAmount)} / {formatCLP(debt.totalAmount)}</span>
        </div>
        <div className="h-3 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${life}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {defeated ? (
        <p className="text-wealth font-semibold text-sm flex items-center gap-1.5">
          <Trophy size={16} /> Jefe derrotado, deuda eliminada
        </p>
      ) : (
        <form onSubmit={handlePay} className="flex gap-2">
          <CurrencyInput
            placeholder="Monto del ataque"
            value={amount}
            onChange={setAmount}
            className="flex-1 bg-card-alt border border-accent-soft/40 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-light"
          />
          <button
            type="submit"
            className="bg-danger hover:bg-danger-dark text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Swords size={16} /> Pagar
          </button>
        </form>
      )}
    </motion.div>
  )
}
