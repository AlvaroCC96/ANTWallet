import type { AntExpense } from '../types/models'
import { getCategory } from '../data/categories'

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportExpensesToCSV(expenses: AntExpense[]) {
  const header = ['Fecha', 'Nombre', 'Categoria', 'Monto', 'Nota']
  const rows = expenses.map((e) => [
    e.date,
    e.name,
    getCategory(e.category)?.label ?? e.category,
    String(e.amount),
    e.note ?? '',
  ])

  const csv = [header, ...rows]
    .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  downloadFile('antwallet-gastos-hormiga.csv', csv, 'text/csv;charset=utf-8;')
}
