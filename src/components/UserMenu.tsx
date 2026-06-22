import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Check, X, LogOut, User as UserIcon } from 'lucide-react'
import { useAuth } from '../store/AuthContext'

function fallbackName(email: string | null | undefined): string {
  if (!email) return 'Usuario'
  const local = email.split('@')[0]
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function UserMenu() {
  const { user, displayName, updateDisplayName, logOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const shownName = displayName || fallbackName(user?.email)
  const initial = shownName.trim().charAt(0).toUpperCase() || <UserIcon size={16} />

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setEditing(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        setEditing(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await updateDisplayName(name.trim())
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Cuenta"
        className="w-9 h-9 rounded-full bg-accent hover:bg-accent-light text-white font-semibold flex items-center justify-center transition-colors shrink-0"
      >
        {initial}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-2 w-56 bg-card-alt border border-accent-soft/40 rounded-xl shadow-xl p-3 z-30"
          >
            {editing ? (
              <form onSubmit={handleSave} className="flex items-center gap-1.5 mb-2">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="flex-1 min-w-0 bg-card border border-accent-soft/40 rounded-lg px-2 py-1 text-sm text-ink focus:outline-none focus:border-accent-light"
                />
                <button type="submit" disabled={saving} className="text-accent-light hover:text-accent-soft disabled:opacity-50 shrink-0">
                  <Check size={16} />
                </button>
                <button type="button" onClick={() => setEditing(false)} className="text-muted hover:text-danger shrink-0">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  setName(displayName ?? '')
                  setEditing(true)
                }}
                className="flex items-center justify-between w-full text-sm text-ink font-medium hover:text-accent-light transition-colors mb-2"
              >
                <span className="truncate">{shownName}</span>
                <Pencil size={12} className="text-muted shrink-0" />
              </button>
            )}

            <div className="h-px bg-deep-darker/50 my-2" />

            <button
              onClick={logOut}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-danger transition-colors w-full"
            >
              <LogOut size={14} /> Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
