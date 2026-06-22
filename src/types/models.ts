import type { FinancialGoal, UnlockedAchievement } from './rpg'
import type { AIInsight, AIWatcherState } from './ai'

export type AccountType = 'checking' | 'savings' | 'cash' | 'investment' | 'wallet'

export interface Account {
  id: string
  bankName: string
  accountName: string
  accountType: AccountType
  balance: number
  icon: string
  createdAt: string
}

export interface Debt {
  id: string
  name: string
  institution: string
  totalAmount: number
  remainingAmount: number
  minimumPayment: number
  icon: string
  createdAt: string
  /** Marks this debt as a credit card: totalAmount is its cupo (limit), remainingAmount is what's used. */
  isCreditCard?: boolean
}

export interface AntExpense {
  id: string
  name: string
  category: string
  amount: number
  accountId?: string
  note?: string
  date: string
  createdAt: string
}

export interface DebtPayment {
  id: string
  debtId: string
  amount: number
  date: string
  note?: string
  createdAt: string
}

export interface AppSettings {
  monthlyAntBudget: number
}

export interface AppData {
  accounts: Account[]
  debts: Debt[]
  expenses: AntExpense[]
  payments: DebtPayment[]
  goals: FinancialGoal[]
  unlockedAchievements: UnlockedAchievement[]
  aiInsights: AIInsight[]
  aiWatcherState: AIWatcherState
  settings: AppSettings
}
