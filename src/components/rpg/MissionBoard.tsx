import { useState } from 'react'
import { Target, Plus } from 'lucide-react'
import { useApp } from '../../store/AppContext'
import { MISSION_TYPES } from '../../data/missionTypes'
import type { GoalType } from '../../types/rpg'
import { CurrencyInput } from '../CurrencyInput'
import { Select } from '../Select'
import { MissionCard } from './MissionCard'

const inputClass =
  'w-full bg-card-alt border border-accent-soft/40 rounded-lg px-3 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-accent-light'

export function MissionBoard() {
  const { data, addGoal } = useApp()
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [type, setType] = useState<GoalType>('emergency_fund')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Ponle un nombre a tu misión.')
      return
    }
    const target = Number(targetAmount)
    if (!target || target <= 0) {
      setError('La meta debe ser mayor a $0.')
      return
    }

    const missionType = MISSION_TYPES.find((t) => t.value === type) ?? MISSION_TYPES[0]
    addGoal({ title: title.trim(), targetAmount: target, currentAmount: 0, type, icon: missionType.icon })

    setTitle('')
    setTargetAmount('')
  }

  return (
    <div className="bg-card border border-deep-darker/60 rounded-2xl p-5 space-y-4">
      <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
        <Target size={20} className="text-accent-light" /> Misiones financieras
      </h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input className={inputClass} placeholder="Nombre de la misión" value={title} onChange={(e) => setTitle(e.target.value)} />
        <CurrencyInput className={inputClass} placeholder="Monto objetivo" value={targetAmount} onChange={setTargetAmount} />
        <Select
          value={type}
          onChange={(value) => setType(value as GoalType)}
          options={MISSION_TYPES.map((t) => ({ value: t.value, label: t.label, icon: t.Icon }))}
        />
        <button
          type="submit"
          className="bg-accent hover:bg-accent-light text-white text-sm font-semibold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5"
        >
          <Plus size={16} /> Crear misión
        </button>
        {error && <p className="text-danger text-xs sm:col-span-2">{error}</p>}
      </form>

      {data.goals.length === 0 ? (
        <p className="text-muted text-sm">Aún no tienes misiones activas. ¡Crea la primera!</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {data.goals.map((goal) => (
            <MissionCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  )
}
