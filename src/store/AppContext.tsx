import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'
import type { Account, AntExpense, AppData, Debt, DebtPayment } from '../types/models'
import type { FinancialGoal } from '../types/rpg'
import { todayISO } from '../utils/dates'
import { isGoalCompleted } from '../utils/missions'
import { DEMO_DATA } from '../data/demo'

const EMPTY_DATA: AppData = {
  accounts: [],
  debts: [],
  expenses: [],
  payments: [],
  goals: [],
  unlockedAchievements: [],
  settings: { monthlyAntBudget: 150000 },
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Normalizes documents written before a field existed (e.g. `goals`) so older
// Firestore docs don't crash the app when a new field is introduced.
function normalizeData(raw: Partial<AppData>): AppData {
  return {
    ...EMPTY_DATA,
    ...raw,
    settings: { ...EMPTY_DATA.settings, ...raw.settings },
    goals: raw.goals ?? [],
    unlockedAchievements: raw.unlockedAchievements ?? [],
  }
}

interface AppContextValue {
  data: AppData
  loading: boolean
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void
  deleteAccount: (id: string) => void
  adjustAccountBalance: (id: string, delta: number) => void
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => void
  deleteDebt: (id: string) => void
  addExpense: (expense: Omit<AntExpense, 'id' | 'createdAt'>) => AntExpense
  deleteExpense: (id: string) => void
  addPayment: (payment: Omit<DebtPayment, 'id' | 'createdAt'>) => { debt: Debt | undefined; defeated: boolean }
  deletePayment: (id: string) => void
  updateBudget: (amount: number) => void
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'completedAt'>) => void
  updateGoalAmount: (id: string, currentAmount: number) => { completed: boolean }
  deleteGoal: (id: string) => void
  recordAchievementUnlocks: (ids: string[]) => void
  loadDemo: () => void
  clearAll: () => void
  importBackup: (json: AppData) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.uid
  const [dataState, setDataState] = useState<AppData>(EMPTY_DATA)
  const [loadingState, setLoadingState] = useState(true)

  useEffect(() => {
    if (!userId) return

    // No setLoadingState(true) here: the initial state is already `true`, and
    // userId only ever transitions once per mount (see Gate/AccessGate below).
    const ref = doc(db, 'users', userId)
    const unsubscribe = onSnapshot(ref, async (snapshot) => {
      if (snapshot.exists()) {
        setDataState(normalizeData(snapshot.data() as Partial<AppData>))
      } else {
        await setDoc(ref, EMPTY_DATA)
        setDataState(EMPTY_DATA)
      }
      setLoadingState(false)
    })

    return unsubscribe
  }, [userId])

  // AppProvider only ever mounts once a userId is known (see Gate/AccessGate in
  // App.tsx), so these fallbacks mostly guard the type-level `undefined` case.
  const data = userId ? dataState : EMPTY_DATA
  const loading = userId ? loadingState : false

  const value = useMemo<AppContextValue>(() => {
    function persist(next: AppData) {
      setDataState(next)
      if (userId) {
        void setDoc(doc(db, 'users', userId), next)
      }
    }

    return {
      data,
      loading,
      addAccount: (account) => {
        const newAccount: Account = { ...account, id: generateId(), createdAt: todayISO() }
        persist({ ...data, accounts: [...data.accounts, newAccount] })
      },
      deleteAccount: (id) => {
        persist({ ...data, accounts: data.accounts.filter((a) => a.id !== id) })
      },
      adjustAccountBalance: (id, delta) => {
        persist({
          ...data,
          accounts: data.accounts.map((a) => (a.id === id ? { ...a, balance: a.balance + delta } : a)),
        })
      },
      addDebt: (debt) => {
        const newDebt: Debt = { ...debt, id: generateId(), createdAt: todayISO() }
        persist({ ...data, debts: [...data.debts, newDebt] })
      },
      deleteDebt: (id) => {
        persist({ ...data, debts: data.debts.filter((d) => d.id !== id) })
      },
      addExpense: (expense) => {
        const newExpense: AntExpense = { ...expense, id: generateId(), createdAt: todayISO() }
        const accounts = expense.accountId
          ? data.accounts.map((a) =>
              a.id === expense.accountId ? { ...a, balance: a.balance - expense.amount } : a,
            )
          : data.accounts
        persist({ ...data, accounts, expenses: [...data.expenses, newExpense] })
        return newExpense
      },
      deleteExpense: (id) => {
        persist({ ...data, expenses: data.expenses.filter((e) => e.id !== id) })
      },
      addPayment: (payment) => {
        const newPayment: DebtPayment = { ...payment, id: generateId(), createdAt: todayISO() }
        let updatedDebt: Debt | undefined
        let defeated = false
        const debts = data.debts.map((d) => {
          if (d.id !== payment.debtId) return d
          const remainingAmount = Math.max(0, d.remainingAmount - payment.amount)
          defeated = d.remainingAmount > 0 && remainingAmount === 0
          updatedDebt = { ...d, remainingAmount }
          return updatedDebt
        })
        persist({ ...data, debts, payments: [...data.payments, newPayment] })
        return { debt: updatedDebt, defeated }
      },
      deletePayment: (id) => {
        persist({ ...data, payments: data.payments.filter((p) => p.id !== id) })
      },
      updateBudget: (amount) => {
        persist({ ...data, settings: { ...data.settings, monthlyAntBudget: amount } })
      },
      addGoal: (goal) => {
        const newGoal: FinancialGoal = { ...goal, id: generateId(), createdAt: todayISO() }
        persist({ ...data, goals: [...data.goals, newGoal] })
      },
      updateGoalAmount: (id, currentAmount) => {
        let completed = false
        const goals = data.goals.map((g) => {
          if (g.id !== id) return g
          const updated: FinancialGoal = { ...g, currentAmount: Math.max(0, currentAmount) }
          if (!g.completedAt && isGoalCompleted(updated)) {
            updated.completedAt = todayISO()
            completed = true
          }
          return updated
        })
        persist({ ...data, goals })
        return { completed }
      },
      deleteGoal: (id) => {
        persist({ ...data, goals: data.goals.filter((g) => g.id !== id) })
      },
      recordAchievementUnlocks: (ids) => {
        if (ids.length === 0) return
        const existing = new Set(data.unlockedAchievements.map((u) => u.id))
        const newEntries = ids.filter((id) => !existing.has(id)).map((id) => ({ id, unlockedAt: todayISO() }))
        if (newEntries.length === 0) return
        persist({ ...data, unlockedAchievements: [...data.unlockedAchievements, ...newEntries] })
      },
      loadDemo: () => {
        persist(DEMO_DATA)
      },
      clearAll: () => {
        persist(EMPTY_DATA)
      },
      importBackup: (json) => {
        persist(normalizeData(json))
      },
    }
  }, [data, loading, userId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
