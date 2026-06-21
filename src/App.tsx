import { lazy, Suspense, useState } from 'react'
import { Bug, Home, Landmark, Skull, Trophy, Settings, ShieldCheck, type LucideIcon } from 'lucide-react'
import { AuthProvider, useAuth } from './store/AuthContext'
import { AccessProvider, useAccess } from './store/AccessContext'
import { AppProvider, useApp } from './store/AppContext'
import { FxProvider } from './store/FxContext'
import { AuthScreen } from './components/auth/AuthScreen'
import { AccessDeniedNotice } from './components/auth/AccessDeniedNotice'
import { UserBadge } from './components/UserBadge'
import { AchievementWatcher } from './components/rpg/AchievementWatcher'

// Each tab's content is loaded on demand: keeps the initial bundle (login +
// access gating) small, since none of this is needed before the user is in.
const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })))
const AccountForm = lazy(() => import('./components/AccountForm').then((m) => ({ default: m.AccountForm })))
const AccountList = lazy(() => import('./components/AccountList').then((m) => ({ default: m.AccountList })))
const DebtForm = lazy(() => import('./components/DebtForm').then((m) => ({ default: m.DebtForm })))
const DebtList = lazy(() => import('./components/DebtList').then((m) => ({ default: m.DebtList })))
const ExpenseForm = lazy(() => import('./components/ExpenseForm').then((m) => ({ default: m.ExpenseForm })))
const ExpenseList = lazy(() => import('./components/ExpenseList').then((m) => ({ default: m.ExpenseList })))
const Achievements = lazy(() => import('./components/Achievements').then((m) => ({ default: m.Achievements })))
const ExportImport = lazy(() => import('./components/ExportImport').then((m) => ({ default: m.ExportImport })))
const AdminPanel = lazy(() => import('./components/admin/AdminPanel').then((m) => ({ default: m.AdminPanel })))

type Tab = 'dashboard' | 'accounts' | 'debts' | 'expenses' | 'achievements' | 'data' | 'admin'

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'accounts', label: 'Cuentas', icon: Landmark },
  { id: 'debts', label: 'Deudas', icon: Skull },
  { id: 'expenses', label: 'Gastos', icon: Bug },
  { id: 'achievements', label: 'Logros', icon: Trophy },
  { id: 'data', label: 'Datos', icon: Settings },
]

function Spinner() {
  return (
    <div className="min-h-screen bg-deep flex items-center justify-center">
      <Bug className="text-accent-light animate-pulse" size={32} />
    </div>
  )
}

function TabSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Bug className="text-accent-light animate-pulse" size={28} />
    </div>
  )
}

function AppContent() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const { isAdmin } = useAccess()
  const { loading } = useApp()

  if (loading) return <Spinner />

  const tabs = isAdmin ? [...TABS, { id: 'admin' as Tab, label: 'Admin', icon: ShieldCheck }] : TABS

  return (
    <div className="min-h-screen bg-deep">
      <AchievementWatcher />
      <header className="border-b border-deep-darker/60 px-4 sm:px-8 py-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bug className="text-accent-light" /> ANT<span className="text-accent-light">Wallet</span>
          </h1>
          <p className="text-sm text-gray-400">Tu billetera, atacada por hormigas y defendida por ti.</p>
        </div>
        <UserBadge />
      </header>

      <nav className="flex flex-wrap gap-2 px-4 sm:px-8 py-3 border-b border-deep-darker/40">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              tab === t.id ? 'bg-accent text-white' : 'bg-card text-gray-400 hover:text-white'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </nav>

      <main className="px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-6">
        <Suspense fallback={<TabSpinner />}>
          {tab === 'dashboard' && <Dashboard />}

          {tab === 'accounts' && (
            <div className="space-y-4">
              <AccountForm />
              <AccountList />
            </div>
          )}

          {tab === 'debts' && (
            <div className="space-y-4">
              <DebtForm />
              <DebtList />
            </div>
          )}

          {tab === 'expenses' && (
            <div className="space-y-4">
              <ExpenseForm />
              <ExpenseList />
            </div>
          )}

          {tab === 'achievements' && <Achievements />}

          {tab === 'data' && <ExportImport />}

          {tab === 'admin' && isAdmin && <AdminPanel />}
        </Suspense>
      </main>
    </div>
  )
}

function AccessGate() {
  const { status } = useAccess()

  if (status === 'checking') return <Spinner />
  if (status === 'denied') return <AccessDeniedNotice />

  return (
    <AppProvider>
      <FxProvider>
        <AppContent />
      </FxProvider>
    </AppProvider>
  )
}

function Gate() {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />
  if (!user) return <AuthScreen />

  return (
    <AccessProvider>
      <AccessGate />
    </AccessProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}

export default App
