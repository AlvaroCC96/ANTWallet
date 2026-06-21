import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Skull, X, Swords, Trophy, AlertTriangle } from 'lucide-react'
import type { Debt } from '../types/models'
import { useApp } from '../store/AppContext'
import { useFx } from '../store/FxContext'
import { debtLife } from '../utils/calculations'
import { generateDebtBossName, getBossLifeState, BOSS_LIFE_STATE_LABEL } from '../utils/bossNames'
import { bossWeakenedMessage } from '../data/messages'
import { getPaymentXP, XP_RULES } from '../utils/rpg'
import { formatCLP } from '../utils/currency'
import { todayISO } from '../utils/dates'
import { CurrencyInput } from './CurrencyInput'
import { Icon } from './Icon'
import { FloatingDamage } from './rpg/FloatingDamage'

const HIT_PHRASES = ['Golpe directo al jefe de deuda', '¡Crítico! El jefe tiembla', 'Buen ataque, sigue así']

const LIFE_STATE_STYLE: Record<string, { bar: string; badge: string }> = {
  strong: { bar: 'bg-wealth', badge: 'text-wealth bg-wealth/10' },
  wounded: { bar: 'bg-warning', badge: 'text-warning bg-warning/10' },
  critical: { bar: 'bg-danger', badge: 'text-danger bg-danger/10' },
  defeated: { bar: 'bg-gray-500', badge: 'text-muted bg-gray-500/10' },
}

export function BossDebt({ debt }: { debt: Debt }) {
  const { addPayment, deleteDebt } = useApp()
  const { showToast, defeatBoss } = useFx()
  const [amount, setAmount] = useState('')
  const [hit, setHit] = useState(false)
  const [hits, setHits] = useState<{ id: number; amount: number }[]>([])
  const hitIdRef = useRef(0)

  const life = debtLife(debt)
  const lifeState = getBossLifeState(debt)
  const defeated = lifeState === 'defeated'
  const bossName = generateDebtBossName(debt)
  const style = LIFE_STATE_STYLE[lifeState]

  function handlePay(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return

    if (value > debt.remainingAmount) {
      showToast('No puedes pagar más de lo que debes', AlertTriangle)
      return
    }

    const lifeBefore = life
    const lifeAfter = debt.totalAmount > 0 ? Math.max(0, ((debt.remainingAmount - value) / debt.totalAmount) * 100) : 0
    const { defeated: wasDefeated } = addPayment({ debtId: debt.id, amount: value, date: todayISO() })

    setHit(true)
    setTimeout(() => setHit(false), 400)

    const hitId = hitIdRef.current++
    setHits((prev) => [...prev, { id: hitId, amount: value }])
    setTimeout(() => setHits((prev) => prev.filter((h) => h.id !== hitId)), 1100)

    let xpGained = getPaymentXP({ id: '', debtId: debt.id, amount: value, date: '', createdAt: '' }, debt)
    if (wasDefeated) xpGained += XP_RULES.debtDefeated

    if (wasDefeated) {
      defeatBoss({ name: debt.name, icon: debt.icon })
      showToast(`🏆 Jefe derrotado (+${xpGained} XP)`, Trophy)
    } else if (lifeBefore >= 50 && lifeAfter < 50) {
      showToast(`${bossWeakenedMessage()} (+${xpGained} XP)`, Swords)
    } else {
      const phrase = HIT_PHRASES[Math.floor(Math.random() * HIT_PHRASES.length)]
      showToast(`${phrase} (+${xpGained} XP)`, Swords)
    }

    setAmount('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, x: hit ? [0, -6, 6, -4, 4, 0] : 0 }}
      transition={{ duration: 0.4 }}
      className={`relative bg-card border rounded-2xl p-5 space-y-3 ${defeated ? 'border-wealth/60' : 'border-deep-darker/60'}`}
    >
      <AnimatePresence>
        {hits.map((h) => (
          <FloatingDamage key={h.id} amount={h.amount} />
        ))}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`p-2 rounded-lg bg-deep ${defeated ? 'text-muted' : 'text-danger'}`}>
            {defeated ? <Skull size={26} /> : <Icon name={debt.icon} size={26} />}
          </span>
          <div>
            <p className="font-bold text-ink">{debt.name}</p>
            <p className="text-xs text-muted">
              {debt.institution} · {bossName.emoji} {bossName.name}
            </p>
          </div>
        </div>
        <button onClick={() => deleteDebt(debt.id)} className="text-muted hover:text-danger">
          <X size={16} />
        </button>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted mb-1">
          <span className={`px-1.5 py-0.5 rounded ${style.badge}`}>{BOSS_LIFE_STATE_LABEL[lifeState]}</span>
          <span>{formatCLP(debt.remainingAmount)} / {formatCLP(debt.totalAmount)}</span>
        </div>
        <div className="h-3 bg-track rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${style.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${life}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        {debt.isCreditCard && (
          <p className="text-xs text-muted mt-1">
            💳 Cupo: {formatCLP(debt.totalAmount)} · Usado: {formatCLP(debt.remainingAmount)} · Disponible:{' '}
            {formatCLP(Math.max(0, debt.totalAmount - debt.remainingAmount))}
          </p>
        )}
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
            className="flex-1 bg-card-alt border border-accent-soft/40 rounded-lg px-3 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-accent-light"
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
