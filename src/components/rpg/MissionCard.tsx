import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, CheckCircle2, Rocket } from 'lucide-react'
import type { FinancialGoal } from '../../types/rpg'
import { useApp } from '../../store/AppContext'
import { useFx } from '../../store/FxContext'
import { goalProgress } from '../../utils/missions'
import { getMissionType } from '../../data/missionTypes'
import { goalCompletedMessage } from '../../data/messages'
import { formatCLP } from '../../utils/currency'
import { XP_RULES } from '../../utils/rpg'
import { CurrencyInput } from '../CurrencyInput'

export function MissionCard({ goal }: { goal: FinancialGoal }) {
  const { updateGoalAmount, deleteGoal } = useApp()
  const { showToast } = useFx()
  const [amount, setAmount] = useState('')

  const missionType = getMissionType(goal.type)
  const progress = goalProgress(goal)
  const completed = Boolean(goal.completedAt)

  function handleAddFunds(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return

    const { completed: justCompleted } = updateGoalAmount(goal.id, goal.currentAmount + value)
    if (justCompleted) {
      showToast(`${goalCompletedMessage(goal.title)} (+${XP_RULES.goalCompleted} XP)`, Rocket)
    }
    setAmount('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={
        completed
          ? { opacity: 1, y: 0, boxShadow: ['0 0 0px rgba(34,197,94,0)', '0 0 18px rgba(34,197,94,0.5)', '0 0 0px rgba(34,197,94,0)'] }
          : { opacity: 1, y: 0 }
      }
      transition={completed ? { duration: 1.6, repeat: 2 } : { duration: 0.3 }}
      className={`bg-card-alt border rounded-xl p-4 space-y-2 ${completed ? 'border-wealth/60' : 'border-deep-darker/50'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-accent-light bg-card rounded-lg p-1.5">
            <missionType.Icon size={18} />
          </span>
          <p className="font-medium text-ink text-sm">{goal.title}</p>
        </div>
        <button onClick={() => deleteGoal(goal.id)} className="text-muted hover:text-danger">
          <X size={14} />
        </button>
      </div>

      <div className="text-xs text-muted">
        {formatCLP(goal.currentAmount)} / {formatCLP(goal.targetAmount)}
      </div>
      <div className="h-2.5 bg-track rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${completed ? 'bg-wealth' : 'bg-accent'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {completed ? (
        <p className="text-wealth text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 size={14} /> Misión completada
        </p>
      ) : (
        <form onSubmit={handleAddFunds} className="flex gap-2">
          <CurrencyInput
            value={amount}
            onChange={setAmount}
            placeholder="Agregar fondos"
            className="flex-1 bg-card border border-accent-soft/40 rounded-lg px-2 py-1.5 text-xs text-ink placeholder-muted focus:outline-none focus:border-accent-light"
          />
          <button
            type="submit"
            className="bg-accent hover:bg-accent-light text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <Plus size={14} />
          </button>
        </form>
      )}
    </motion.div>
  )
}
