import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useApp } from '../../store/AppContext'
import { calculateAchievements } from '../../utils/achievements'
import { AchievementToast } from './AchievementToast'

interface QueuedAchievement {
  id: number
  title: string
  description: string
}

export function AchievementWatcher() {
  const { data, loading, recordAchievementUnlocks } = useApp()
  const idRef = useRef(0)
  const [queue, setQueue] = useState<QueuedAchievement[]>([])

  useEffect(() => {
    if (loading) return

    const achievements = calculateAchievements(data)
    const unlocked = achievements.filter((a) => a.unlocked)
    const alreadyRecorded = new Set(data.unlockedAchievements.map((u) => u.id))
    const newlyUnlocked = unlocked.filter((a) => !alreadyRecorded.has(a.id))

    if (newlyUnlocked.length === 0) return

    recordAchievementUnlocks(newlyUnlocked.map((a) => a.id))

    // Don't toast-flood the first time this log starts tracking an existing user's progress.
    if (data.unlockedAchievements.length === 0) return

    setQueue((prev) => [
      ...prev,
      ...newlyUnlocked.map((a) => ({ id: idRef.current++, title: a.title, description: a.description })),
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recordAchievementUnlocks identity changes with data; re-running on it would loop.
  }, [data, loading])

  useEffect(() => {
    if (queue.length === 0) return
    const timer = setTimeout(() => setQueue((prev) => prev.slice(1)), 4000)
    return () => clearTimeout(timer)
  }, [queue])

  return (
    <div className="fixed top-20 right-4 z-[95] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {queue.slice(0, 1).map((item) => (
          <AchievementToast key={item.id} title={item.title} description={item.description} />
        ))}
      </AnimatePresence>
    </div>
  )
}
