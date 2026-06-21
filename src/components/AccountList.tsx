import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, X, Plus, Minus, PiggyBank, Banknote } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useFx } from '../store/FxContext'
import { formatCLP } from '../utils/currency'
import { CurrencyInput } from './CurrencyInput'
import { Icon } from './Icon'

const inputClass =
  'flex-1 bg-card border border-accent-soft/40 rounded-lg px-3 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-accent-light'

export function AccountList() {
  const { data, deleteAccount, adjustAccountBalance } = useApp()
  const { showToast } = useFx()
  const [openId, setOpenId] = useState<string | null>(null)
  const [amount, setAmount] = useState('')

  if (data.accounts.length === 0) {
    return <p className="text-muted text-sm">Aún no agregas cuentas. ¡Crea la primera!</p>
  }

  function handleAdjust(id: string, sign: 1 | -1) {
    const value = Number(amount)
    if (!value || value <= 0) return
    adjustAccountBalance(id, value * sign)
    showToast(sign === 1 ? 'Depósito registrado' : 'Saldo reducido', sign === 1 ? PiggyBank : Banknote)
    setAmount('')
    setOpenId(null)
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <AnimatePresence>
        {data.accounts.map((account) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card-alt border border-deep-darker/60 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-accent-light bg-card rounded-lg p-2">
                  <Icon name={account.icon} size={26} />
                </span>
                <div>
                  <p className="font-semibold text-ink">{account.accountName}</p>
                  <p className="text-xs text-muted">{account.bankName}</p>
                  <p className="text-wealth font-bold">{formatCLP(account.balance)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setOpenId(openId === account.id ? null : account.id)
                    setAmount('')
                  }}
                  className="text-muted hover:text-accent-light"
                  aria-label="Editar saldo"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteAccount(account.id)}
                  className="text-muted hover:text-danger"
                  aria-label="Eliminar cuenta"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {openId === account.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 overflow-hidden"
                >
                  <CurrencyInput
                    value={amount}
                    onChange={setAmount}
                    placeholder="Monto, ej: sueldo"
                    className={inputClass}
                  />
                  <button
                    onClick={() => handleAdjust(account.id, 1)}
                    className="bg-wealth hover:bg-wealth-dark text-white text-sm font-semibold px-3 py-2 rounded-lg whitespace-nowrap flex items-center gap-1"
                  >
                    <Plus size={16} /> Agregar
                  </button>
                  <button
                    onClick={() => handleAdjust(account.id, -1)}
                    className="bg-danger hover:bg-danger-dark text-white text-sm font-semibold px-3 py-2 rounded-lg whitespace-nowrap flex items-center gap-1"
                  >
                    <Minus size={16} /> Restar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
