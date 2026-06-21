import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { signInWithPopup, signOut, onAuthStateChanged, updateProfile, type User } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

interface AuthContextValue {
  user: User | null
  displayName: string | null
  loading: boolean
  logInWithGoogle: () => Promise<void>
  logOut: () => Promise<void>
  updateDisplayName: (name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setDisplayName(firebaseUser?.displayName ?? null)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function logInWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider)
    setUser(credential.user)
    setDisplayName(credential.user.displayName)
  }

  async function logOut() {
    await signOut(auth)
  }

  async function updateDisplayName(name: string) {
    if (!auth.currentUser) return
    await updateProfile(auth.currentUser, { displayName: name })
    setDisplayName(name)
  }

  return (
    <AuthContext.Provider value={{ user, displayName, loading, logInWithGoogle, logOut, updateDisplayName }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
