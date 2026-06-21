import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { getAchievements } from '../utils/calculations'

export function Achievements() {
  const { data } = useApp()
  const achievements = getAchievements(
    data.accounts,
    data.debts,
    data.expenses,
    data.payments,
    data.settings.monthlyAntBudget,
  )

  return (
    <div className="bg-card border border-deep-darker/60 rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
        <Trophy size={20} className="text-yellow-400" /> Logros
      </h3>
      <div className="grid sm:grid-cols-2 gap-2">
        {achievements.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border ${
              a.unlocked
                ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300'
                : 'border-gray-700/40 bg-black/20 text-gray-500'
            }`}
          >
            <a.icon size={18} className={a.unlocked ? '' : 'opacity-30'} />
            <span>{a.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
