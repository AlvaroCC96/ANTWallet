import { motion } from 'framer-motion'
import { Bug } from 'lucide-react'
import { getAntColonySize } from '../utils/calculations'

export function AntColony({ spent }: { spent: number }) {
  const count = getAntColonySize(spent)

  return (
    <div className="bg-card border border-deep-darker/60 rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
        <Bug size={20} className="text-accent-light" /> Hormiguero del mes
      </h3>
      {count === 0 ? (
        <p className="text-sm text-gray-400">El hormiguero está vacío. ¡Que se mantenga así!</p>
      ) : (
        <div className="flex flex-wrap gap-1.5 text-accent-light">
          {Array.from({ length: count }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              <Bug size={20} />
            </motion.span>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">La colonia está creciendo… ({count}/30)</p>
    </div>
  )
}
