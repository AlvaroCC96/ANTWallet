import { AnimatePresence } from 'framer-motion'
import { useApp } from '../store/AppContext'
import { BossDebt } from './BossDebt'

export function DebtList() {
  const { data } = useApp()

  if (data.debts.length === 0) {
    return <p className="text-gray-400 text-sm">No hay jefes de deuda activos. ¡Disfruta la paz!</p>
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <AnimatePresence>
        {data.debts.map((debt) => (
          <BossDebt key={debt.id} debt={debt} />
        ))}
      </AnimatePresence>
    </div>
  )
}
