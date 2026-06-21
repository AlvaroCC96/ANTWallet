export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatThousands(digits: string): string {
  if (!digits) return ''
  return Number(digits).toLocaleString('es-CL')
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}
