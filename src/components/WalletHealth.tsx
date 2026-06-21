import { motion, useAnimate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Wallet, ShieldCheck, AlertTriangle, AlertOctagon, Pencil, Check, X, type LucideIcon } from 'lucide-react'
import { getWalletHealth } from '../utils/calculations'
import { formatCLP } from '../utils/currency'
import { useFx } from '../store/FxContext'
import { useApp } from '../store/AppContext'
import { CurrencyInput } from './CurrencyInput'

const STATUS_LABEL: Record<string, string> = {
  healthy: 'Saludable',
  alert: 'Alerta',
  danger: 'Peligro',
}

const STATUS_ICON: Record<string, LucideIcon> = {
  healthy: ShieldCheck,
  alert: AlertTriangle,
  danger: AlertOctagon,
}

const STATUS_COLOR: Record<string, string> = {
  healthy: 'bg-wealth',
  alert: 'bg-warning',
  danger: 'bg-danger',
}

const STATUS_TEXT_COLOR: Record<string, string> = {
  healthy: 'text-wealth',
  alert: 'text-warning',
  danger: 'text-danger',
}

export function WalletHealth({ spent }: { spent: number }) {
  const { shakeTick } = useFx()
  const { data, updateBudget } = useApp()
  const budget = data.settings.monthlyAntBudget
  const [scope, animate] = useAnimate()
  const [editing, setEditing] = useState(false)
  const [draftBudget, setDraftBudget] = useState('')
  const { life, status } = getWalletHealth(spent, budget)
  const StatusIcon = STATUS_ICON[status]

  useEffect(() => {
    if (shakeTick === 0) return
    void animate(scope.current, { x: [0, -8, 8, -6, 6, 0] }, { duration: 0.4 })
  }, [shakeTick, animate, scope])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(draftBudget)
    if (!value || value <= 0) return
    updateBudget(value)
    setEditing(false)
  }

  return (
    <motion.div ref={scope} className="bg-card border border-deep-darker/60 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Wallet size={20} className="text-accent-light" /> Vida de la billetera
        </h3>
        <span className={`text-sm font-semibold flex items-center gap-1 ${STATUS_TEXT_COLOR[status]}`}>
          <StatusIcon size={16} /> {STATUS_LABEL[status]}
        </span>
      </div>
      <div className="h-4 bg-black/40 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${STATUS_COLOR[status]}`}
          initial={{ width: 0 }}
          animate={{ width: `${life}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Presupuesto mensual:</span>
          <CurrencyInput
            value={draftBudget}
            onChange={setDraftBudget}
            placeholder="150.000"
            className="flex-1 bg-card-alt border border-accent-soft/40 rounded-lg px-2 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-light"
          />
          <button type="submit" className="text-accent-light hover:text-accent-soft">
            <Check size={16} />
          </button>
          <button type="button" onClick={() => setEditing(false)} className="text-gray-500 hover:text-danger">
            <X size={16} />
          </button>
        </form>
      ) : (
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          Gastado este mes: <span className="text-orange-400 font-semibold">{formatCLP(spent)}</span> de{' '}
          {formatCLP(budget)}
          <button
            onClick={() => {
              setDraftBudget(String(budget))
              setEditing(true)
            }}
            className="text-gray-500 hover:text-accent-light"
            aria-label="Editar presupuesto mensual"
          >
            <Pencil size={12} />
          </button>
        </p>
      )}
    </motion.div>
  )
}
