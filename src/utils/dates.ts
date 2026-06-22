export function isSameMonth(dateStr: string, reference: Date = new Date()): boolean {
  const d = new Date(dateStr)
  return d.getFullYear() === reference.getFullYear() && d.getMonth() === reference.getMonth()
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function nowISO(): string {
  return new Date().toISOString()
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)

  if (minutes < 1) return 'Generado hace instantes'
  if (minutes < 60) return `Generado hace ${minutes} minuto${minutes === 1 ? '' : 's'}`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Generado hace ${hours} hora${hours === 1 ? '' : 's'}`

  const days = Math.floor(hours / 24)
  return `Generado hace ${days} día${days === 1 ? '' : 's'}`
}
