import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { Users, UserPlus, Trash2, ShieldCheck, ShieldOff } from 'lucide-react'
import { db } from '../../lib/firebase'
import { todayISO } from '../../utils/dates'

interface AllowedUser {
  email: string
  active: boolean
  addedAt: string
}

const inputClass =
  'flex-1 bg-card-alt border border-accent-soft/40 rounded-lg px-3 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-accent-light'

export function AdminPanel() {
  const [users, setUsers] = useState<AllowedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'allowedUsers'), (snapshot) => {
      const list = snapshot.docs.map((d) => d.data() as AllowedUser)
      list.sort((a, b) => a.email.localeCompare(b.email))
      setUsers(list)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const email = newEmail.trim().toLowerCase()
    setError('')
    if (!email || !email.includes('@')) {
      setError('Escribe un correo válido.')
      return
    }
    if (users.some((u) => u.email === email)) {
      setError('Ese correo ya está en la lista.')
      return
    }
    await setDoc(doc(db, 'allowedUsers', email), { email, active: true, addedAt: todayISO() })
    setNewEmail('')
  }

  async function handleToggle(email: string, active: boolean) {
    await updateDoc(doc(db, 'allowedUsers', email), { active: !active })
  }

  async function handleDelete(email: string) {
    if (confirm(`¿Quitar el acceso de ${email}?`)) {
      await deleteDoc(doc(db, 'allowedUsers', email))
    }
  }

  return (
    <div className="bg-card border border-deep-darker/60 rounded-2xl p-5 space-y-4">
      <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
        <Users size={20} className="text-accent-light" /> Usuarios permitidos
      </h3>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          className={inputClass}
          placeholder="correo@ejemplo.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-accent hover:bg-accent-light text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
        >
          <UserPlus size={16} /> Agregar
        </button>
      </form>
      {error && <p className="text-danger text-sm">{error}</p>}

      {loading ? (
        <p className="text-muted text-sm">Cargando...</p>
      ) : users.length === 0 ? (
        <p className="text-muted text-sm">Aún no agregas a nadie. Solo tú tienes acceso.</p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.email}
              className="bg-card-alt border border-deep-darker/50 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-ink text-sm font-medium">{u.email}</p>
                <p className="text-xs text-muted">Agregado el {u.addedAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(u.email, u.active)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    u.active ? 'bg-wealth/15 text-wealth' : 'bg-track text-muted'
                  }`}
                >
                  {u.active ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                  {u.active ? 'Activo' : 'Inactivo'}
                </button>
                <button onClick={() => handleDelete(u.email)} className="text-muted hover:text-danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
