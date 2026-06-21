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
  const [status, setStatus] = useState<AccessStatus>('checking')

  useEffect(() => {
    if (!user?.email) {
      setStatus('checking')
      return
    }

    if (isAdminEmail(user.email)) {
      setStatus('admin')
      return
    }

    setStatus('checking')
    const ref = doc(db, 'allowedUsers', user.email.toLowerCase())
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const active = snapshot.exists() && snapshot.data().active === true
        setStatus(active ? 'allowed' : 'denied')
      },
      () => setStatus('denied'),
    )

    return unsubscribe
  }, [user?.email])

  return <AccessContext.Provider value={{ status, isAdmin: status === 'admin' }}>{children}</AccessContext.Provider>
}

export function useAccess(): AccessContextValue {
  const ctx = useContext(AccessContext)
  if (!ctx) throw new Error('useAccess must be used within AccessProvider')
  return ctx
}
