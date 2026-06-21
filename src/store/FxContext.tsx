import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Skull, Trophy, type LucideIcon } from 'lucide-react'
import { AnimatedAnt } from '../components/AnimatedAnt'
import { Icon } from '../components/Icon'

interface Toast {
  id: number
  message: string
  icon: LucideIcon
}

interface BossDefeatedInfo {
  name: string
  icon: string
}

interface FxContextValue {
  showToast: (message: string, icon?: LucideIcon) => void
  spawnAnt: () => void
  triggerShake: () => void
  shakeTick: number
  defeatBoss: (info: BossDefeatedInfo) => void
}

const FxContext = createContext<FxContextValue | null>(null)

export function FxProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [ants, setAnts] = useState<number[]>([])
  const [shakeTick, setShakeTick] = useState(0)
  const [bossDefeated, setBossDefeated] = useState<BossDefeatedInfo | null>(null)
  const idRef = useRef(0)

  const showToast = useCallback((message: string, icon: LucideIcon = Trophy) => {
    const id = idRef.current++
    setToasts((prev) => [...prev, { id, message, icon }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const spawnAnt = useCallback(() => {
    const id = idRef.current++
    setAnts((prev) => [...prev, id])
    setTimeout(() => {
      setAnts((prev) => prev.filter((a) => a !== id))
    }, 2200)
  }, [])

  const triggerShake = useCallback(() => {
    setShakeTick((prev) => prev + 1)
  }, [])

  const defeatBoss = useCallback((info: BossDefeatedInfo) => {
    setBossDefeated(info)
  }, [])

  return (
    <FxContext.Provider value={{ showToast, spawnAnt, triggerShake, shakeTick, defeatBoss }}>
      {children}

      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-card border border-accent-soft/50 text-white px-4 py-3 rounded-xl shadow-lg max-w-xs text-sm flex items-center gap-2"
            >
              <t.icon size={18} className="text-accent-light shrink-0" />
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed inset-x-0 top-1/2 z-[90] pointer-events-none overflow-hidden h-0">
        <AnimatePresence>
          {ants.map((id) => <AnimatedAnt key={id} />)}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {bossDefeated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center p-4"
            onClick={() => setBossDefeated(null)}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="bg-gradient-to-br from-deep-magenta to-card border border-yellow-500/50 rounded-2xl p-8 text-center max-w-sm shadow-2xl"
            >
              <div className="flex items-center justify-center gap-2 mb-3 text-yellow-400">
                <Icon name={bossDefeated.icon} size={48} />
                <Skull size={48} />
              </div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-1">¡Jefe derrotado!</h2>
              <p className="text-gray-300">
                <span className="font-semibold">{bossDefeated.name}</span> ha sido eliminado. Deuda saldada por
                completo.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 inline-flex items-center gap-2"
                onClick={() => setBossDefeated(null)}
              >
                <Trophy size={18} /> ¡Victoria!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FxContext.Provider>
  )
}

export function useFx(): FxContextValue {
  const ctx = useContext(FxContext)
  if (!ctx) throw new Error('useFx must be used within FxProvider')
  return ctx
}
