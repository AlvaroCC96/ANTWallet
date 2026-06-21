import { motion } from 'framer-motion'
import { Skull } from 'lucide-react'
import { useApp } from '../store/AppContext'
import {
  getMainBossDebt,
  netWorth,
  totalAntExpensesThisMonth,
  totalAssets,
  totalDebts,
} from '../utils/calculations'
import { formatCLP } from '../utils/currency'
import { WalletHealth } from './WalletHealth'
import { QueenAnt } from './QueenAnt'
import { BossDebt } from './BossDebt'
import { AntColony } from './AntColony'

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function Dashboard() {
  const { data } = useApp()

  const assets = totalAssets(data.accounts)
  const debts = totalDebts(data.debts)
  const net = netWorth(data.accounts, data.debts)
  const spentThisMonth = totalAntExpensesThisMonth(data.expenses)
  const mainBoss = getMainBossDebt(data.debts)

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-card border border-deep-darker/60 rounded-2xl p-5"
        >
          <p className="text-sm text-gray-400">Total activos</p>
          <p className="text-2xl font-bold text-wealth">{formatCLP(assets)}</p>
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.05 }}
          className="bg-card border border-deep-darker/60 rounded-2xl p-5"
        >
          <p className="text-sm text-gray-400">Total deudas</p>
          <p className="text-2xl font-bold text-danger">{formatCLP(debts)}</p>
        </motion.div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="bg-card border border-deep-darker/60 rounded-2xl p-5"
        >
          <p className="text-sm text-gray-400">Patrimonio neto</p>
          <p className={`text-2xl font-bold ${net >= 0 ? 'text-wealth' : 'text-danger'}`}>{formatCLP(net)}</p>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <WalletHealth spent={spentThisMonth} />
        <QueenAnt expenses={data.expenses} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Skull size={20} className="text-danger" /> Jefe de deuda principal
          </h3>
          {mainBoss ? (
            <BossDebt debt={mainBoss} />
          ) : (
            <p className="text-gray-400 text-sm bg-card border border-deep-darker/60 rounded-2xl p-5">
              No tienes deudas activas. ¡La paz reina en el reino!
            </p>
          )}
        </div>
        <AntColony spent={spentThisMonth} />
      </div>
    </div>
  )
}
