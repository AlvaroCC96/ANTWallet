import { motion } from 'framer-motion'
import type { LevelInfo } from '../../types/rpg'

export function LevelProgress({ levelInfo }: { levelInfo: LevelInfo }) {
  const { currentLevelXP, nextLevelXP, progress } = levelInfo
  const percent = Math.max(0, Math.min(100, progress * 100))

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted">
        <span>XP</span>
        <span>
          {currentLevelXP} / {nextLevelXP}
        </span>
      </div>
      <div className="h-3 bg-track rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent-light"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
