import { motion, AnimatePresence } from 'framer-motion'
import { Bug, X } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { getCategory } from '../data/categories'
import { formatCLP } from '../utils/currency'
import { formatDate } from '../utils/dates'

export function ExpenseList() {
  const { data, deleteExpense } = useApp()

  const sorted = [...data.expenses].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  if (sorted.length === 0) {
    return <p className="text-muted text-sm">Aún no registras gastos hormiga. ¡La colonia está tranquila!</p>
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
      <AnimatePresence>
        {sorted.map((expense) => {
          const category = getCategory(expense.category)
          const CategoryIcon = category?.icon ?? Bug
          return (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-card-alt border border-deep-darker/50 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-accent-light bg-card rounded-lg p-2">
                  <CategoryIcon size={20} />
                </span>
                <div>
                  <p className="font-medium text-ink text-sm">{expense.name}</p>
                  <p className="text-xs text-muted">
                    {category?.label} · {formatDate(expense.date)}
                    {expense.note ? ` · ${expense.note}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-400 font-bold text-sm">{formatCLP(expense.amount)}</span>
                <button onClick={() => deleteExpense(expense.id)} className="text-muted hover:text-danger">
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
