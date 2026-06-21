import { useState } from 'react'
import { Skull, CreditCard, Landmark, Flame, Ghost, Swords } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { CurrencyInput } from './CurrencyInput'

const inputClass =
  'w-full bg-card-alt border border-accent-soft/40 rounded-lg px-3 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-accent-light'

const BOSS_ICONS: { name: string; Icon: typeof CreditCard }[] = [
  { name: 'CreditCard', Icon: CreditCard },
  { name: 'Landmark', Icon: Landmark },
  { name: 'Skull', Icon: Skull },
  { name: 'Flame', Icon: Flame },
  { name: 'Ghost', Icon: Ghost },
  { name: 'Swords', Icon: Swords },
]

export function DebtForm() {
  const { addDebt } = useApp()
  const [name, setName] = useState('')
  const [institution, setInstitution] = useState('')
  const [isCreditCard, setIsCreditCard] = useState(false)
  const [totalAmount, setTotalAmount] = useState('')
  const [remainingAmount, setRemainingAmount] = useState('')
  const [minimumPayment, setMinimumPayment] = useState('')
  const [icon, setIcon] = useState(BOSS_ICONS[0].name)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !totalAmount || !remainingAmount) return

    const total = Number(totalAmount)
    const remaining = Number(remainingAmount)
    if (isCreditCard && remaining > total) {
      setError('El cupo usado no puede ser mayor que el cupo total.')
      return
    }

    addDebt({
      name: name.trim(),
      institution: institution.trim(),
      totalAmount: total,
      remainingAmount: remaining,
      minimumPayment: Number(minimumPayment) || 0,
      icon,
      isCreditCard,
    })

    setName('')
    setInstitution('')
    setTotalAmount('')
    setRemainingAmount('')
    setMinimumPayment('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-deep-darker/60 rounded-2xl p-5 space-y-3">
      <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
        <Skull size={20} className="text-danger" /> Agregar jefe de deuda
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className={inputClass} placeholder="Nombre de la deuda" value={name} onChange={(e) => setName(e.target.value)} />
        <input
          className={inputClass}
          placeholder="Institución"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
        <input
          type="checkbox"
          checked={isCreditCard}
          onChange={(e) => {
            setIsCreditCard(e.target.checked)
            if (e.target.checked) setIcon('CreditCard')
          }}
          className="accent-accent"
        />
        Es una tarjeta de crédito (registrar cupo en vez de monto fijo)
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <CurrencyInput
          className={inputClass}
          placeholder={isCreditCard ? 'Cupo total' : 'Monto total'}
          value={totalAmount}
          onChange={setTotalAmount}
        />
        <CurrencyInput
          className={inputClass}
          placeholder={isCreditCard ? 'Cupo usado' : 'Monto pendiente'}
          value={remainingAmount}
          onChange={setRemainingAmount}
        />
        <CurrencyInput
          className={inputClass}
          placeholder="Pago mínimo"
          value={minimumPayment}
          onChange={setMinimumPayment}
        />
      </div>

      {error && <p className="text-danger text-xs">{error}</p>}

      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted">Avatar del jefe:</span>
        {BOSS_ICONS.map(({ name: iconName, Icon: BossIcon }) => (
          <button
            key={iconName}
            type="button"
            onClick={() => setIcon(iconName)}
            className={`rounded-lg px-2 py-1.5 ${
              icon === iconName ? 'bg-accent/40 ring-1 ring-accent-light text-ink' : 'text-muted'
            }`}
          >
            <BossIcon size={20} />
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="w-full bg-danger hover:bg-danger-dark text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Swords size={18} /> Invocar jefe de deuda
      </button>
    </form>
  )
}
