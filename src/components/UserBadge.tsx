import { useState } from 'react'
import { Pencil, Check, X, LogOut } from 'lucide-react'
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

export function UserBadge() {
  const { user, displayName, updateDisplayName, logOut } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const shownName = displayName || fallbackName(user?.email)

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

  if (editing) {
    return (
      <form onSubmit={handleSave} className="flex items-center gap-1.5">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          className="bg-card-alt border border-accent-soft/40 rounded-lg px-2 py-1 text-sm text-ink w-32 focus:outline-none focus:border-accent-light"
        />
        <button type="submit" disabled={saving} className="text-accent-light hover:text-accent-soft disabled:opacity-50">
          <Check size={16} />
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-muted hover:text-danger">
          <X size={16} />
        </button>
      </form>
    )
  }

  return (
    <div className="text-right shrink-0">
      <button
        onClick={() => {
          setName(displayName ?? '')
          setEditing(true)
        }}
        className="text-sm text-ink font-medium flex items-center gap-1.5 justify-end hover:text-accent-light transition-colors"
      >
        {shownName} <Pencil size={12} className="text-muted" />
      </button>
      <button onClick={logOut} className="text-xs text-muted hover:text-danger flex items-center gap-1 mt-1 justify-end">
        <LogOut size={12} /> Cerrar sesión
      </button>
    </div>
  )
}
