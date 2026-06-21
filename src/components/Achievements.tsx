import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { calculateAchievements } from '../utils/achievements'

export function Achievements() {
  const { data } = useApp()
  const achievements = calculateAchievements(data)

  return (
    <div className="bg-card border border-deep-darker/60 rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-ink flex items-center gap-2 mb-3">
        <Trophy size={20} className="text-yellow-500" /> Logros
      </h3>
      <div className="grid sm:grid-cols-2 gap-2">
        {achievements.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm border ${
              a.unlocked
                ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-600'
                : 'border-deep-darker/40 bg-track text-muted'
            }`}
          >
            <a.icon size={18} className={`mt-0.5 shrink-0 ${a.unlocked ? '' : 'opacity-30'}`} />
            <div>
              <p className="font-medium">{a.title}</p>
              <p className={`text-xs ${a.unlocked ? 'text-yellow-600/80' : 'text-muted'}`}>{a.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
