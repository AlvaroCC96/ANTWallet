import { ShieldOff, LogOut } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'

export function AccessDeniedNotice() {
  const { user, logOut } = useAuth()

  return (
    <div className="min-h-screen bg-deep flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-deep-darker/60 rounded-2xl p-6 space-y-4 text-center">
        <ShieldOff size={40} className="text-danger mx-auto" />
        <h2 className="text-xl font-bold text-white">Acceso pendiente</h2>
        <p className="text-sm text-gray-400">
          Tu cuenta <span className="text-white">{user?.email}</span> aún no tiene acceso a ANTWallet. Pídele al
          administrador que te active desde el panel de Admin.
        </p>
        <button
          onClick={logOut}
          className="w-full bg-card-alt hover:bg-deep-darker text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </div>
  )
}
