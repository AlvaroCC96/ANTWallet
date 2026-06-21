import { useState } from 'react'
import { Bug, Zap, Wallet } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useFx } from '../store/FxContext'
import { CATEGORIES } from '../data/categories'
import { todayISO } from '../utils/dates'
import { CurrencyInput } from './CurrencyInput'
import { Select } from './Select'
import { getIconComponent } from './Icon'

const inputClass =
  'w-full bg-card-alt border border-accent-soft/40 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-light'

const SHAKE_THRESHOLD = 20000

const FUN_TOASTS = ['Hormiga detectada', 'La colonia está creciendo…', 'Ese gasto venía con ejército incluido']

const NO_ACCOUNT = ''

export function ExpenseForm() {
  const { data, addExpense } = useApp()
  const { showToast, spawnAnt, triggerShake } = useFx()

  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState(NO_ACCOUNT)
  const [note, setNote] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    if (!name.trim() || !value || value <= 0) return

    addExpense({
      name: name.trim(),
      category,
      amount: value,
      accountId: accountId || undefined,
      note: note.trim() || undefined,
      date: todayISO(),
    })

    spawnAnt()

    if (value >= SHAKE_THRESHOLD) {
      triggerShake()
      showToast('Tu billetera recibió daño crítico', Zap)
    } else {
      const phrase = FUN_TOASTS[Math.floor(Math.random() * FUN_TOASTS.length)]
      showToast(phrase, Bug)
    }

    setName('')
    setAmount('')
    setNote('')
    setAccountId(NO_ACCOUNT)
  }

  const accountOptions = [
    { value: NO_ACCOUNT, label: 'Sin cuenta asociada', icon: Wallet },
    ...data.accounts.map((a) => ({ value: a.id, label: a.accountName, icon: getIconComponent(a.icon) })),
  ]

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-deep-darker/60 rounded-2xl p-5 space-y-3">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Bug size={20} className="text-accent-light" /> Registrar gasto hormiga
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <input className={inputClass} placeholder="Nombre del gasto" value={name} onChange={(e) => setName(e.target.value)} />
        <CurrencyInput className={inputClass} placeholder="Monto" value={amount} onChange={setAmount} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select
          value={category}
          onChange={setCategory}
          options={CATEGORIES.map((c) => ({ value: c.id, label: c.label, icon: c.icon }))}
        />
        <Select value={accountId} onChange={setAccountId} options={accountOptions} />
      </div>
      <input className={inputClass} placeholder="Nota (opcional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Bug size={18} /> Registrar gasto
      </button>
    </form>
  )
}
