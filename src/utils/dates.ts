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
