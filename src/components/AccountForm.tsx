import { useState } from 'react'
import { Plus, Landmark, PiggyBank, Banknote, TrendingUp, Smartphone } from 'lucide-react'
import { useApp } from '../store/AppContext'
import type { AccountType } from '../types/models'
import { CurrencyInput } from './CurrencyInput'
import { Select } from './Select'

const ACCOUNT_TYPES: { value: AccountType; label: string; icon: string; Icon: typeof Landmark }[] = [
  { value: 'checking', label: 'Cuenta Corriente', icon: 'Landmark', Icon: Landmark },
  { value: 'savings', label: 'Cuenta Ahorro', icon: 'PiggyBank', Icon: PiggyBank },
  { value: 'cash', label: 'Efectivo', icon: 'Banknote', Icon: Banknote },
  { value: 'investment', label: 'Inversión', icon: 'TrendingUp', Icon: TrendingUp },
  { value: 'wallet', label: 'Billetera Digital', icon: 'Smartphone', Icon: Smartphone },
]

const inputClass =
  'w-full bg-card-alt border border-accent-soft/40 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-light'

export function AccountForm() {
  const { addAccount } = useApp()
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountType, setAccountType] = useState<AccountType>('checking')
  const [balance, setBalance] = useState('')
  const [icon, setIcon] = useState('Landmark')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!bankName.trim() || !accountName.trim() || !balance) return

    addAccount({
      bankName: bankName.trim(),
      accountName: accountName.trim(),
      accountType,
      balance: Number(balance),
      icon,
    })

    setBankName('')
    setAccountName('')
    setBalance('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-deep-darker/60 rounded-2xl p-5 space-y-3">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Plus size={20} className="text-accent-light" /> Agregar cuenta
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className={inputClass}
          placeholder="Banco / Institución"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Nombre de la cuenta"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          value={accountType}
          onChange={(value) => {
            const type = value as AccountType
            setAccountType(type)
            setIcon(ACCOUNT_TYPES.find((t) => t.value === type)?.icon ?? 'Landmark')
          }}
          options={ACCOUNT_TYPES.map((t) => ({ value: t.value, label: t.label, icon: t.Icon }))}
        />
        <CurrencyInput className={inputClass} placeholder="Saldo actual" value={balance} onChange={setBalance} />
      </div>
      <button
        type="submit"
        className="w-full bg-accent hover:bg-accent-light text-white font-semibold py-2 rounded-lg transition-colors"
      >
        Agregar cuenta
      </button>
    </form>
  )
}
