import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../store/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Cambiar a modo nocturno' : 'Cambiar a modo claro'}
      className="text-muted hover:text-accent bg-card-alt border border-deep-darker/50 rounded-lg p-2 transition-colors"
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
