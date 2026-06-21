import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'
import { isAdminEmail } from '../config/admin'

type AccessStatus = 'checking' | 'admin' | 'allowed' | 'denied'

interface AccessContextValue {
  status: AccessStatus
  isAdmin: boolean
}

const AccessContext = createContext<AccessContextValue | null>(null)

export function AccessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const isAdmin = isAdminEmail(user?.email)
  const [allowedStatus, setAllowedStatus] = useState<'checking' | 'allowed' | 'denied'>('checking')

  useEffect(() => {
    if (!user?.email || isAdmin) return

    const ref = doc(db, 'allowedUsers', user.email.toLowerCase())
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const active = snapshot.exists() && snapshot.data().active === true
        setAllowedStatus(active ? 'allowed' : 'denied')
      },
      () => setAllowedStatus('denied'),
    )

    return unsubscribe
  }, [user?.email, isAdmin])

  // AccessProvider only mounts once a user exists (see Gate in App.tsx) and always
  // fully remounts on logout/login, so deriving from render-time values here is safe.
  const status: AccessStatus = !user?.email ? 'checking' : isAdmin ? 'admin' : allowedStatus

  return <AccessContext.Provider value={{ status, isAdmin }}>{children}</AccessContext.Provider>
}

export function useAccess(): AccessContextValue {
  const ctx = useContext(AccessContext)
  if (!ctx) throw new Error('useAccess must be used within AccessProvider')
  return ctx
}
