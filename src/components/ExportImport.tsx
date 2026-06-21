import { useRef, useState } from 'react'
import { Settings, FileText, Download, Upload, Sparkles, Trash2, XCircle, Wallet, Check } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { useFx } from '../store/FxContext'
import { exportExpensesToCSV, downloadFile } from '../utils/csv'
import { formatCLP } from '../utils/currency'
import type { AppData } from '../types/models'
import { CurrencyInput } from './CurrencyInput'

export function ExportImport() {
  const { data, importBackup, loadDemo, clearAll, updateBudget } = useApp()
  const { showToast } = useFx()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draftBudget, setDraftBudget] = useState(String(data.settings.monthlyAntBudget))

  function handleExportJSON() {
    downloadFile('antwallet-backup.json', JSON.stringify(data, null, 2), 'application/json')
    showToast('Backup exportado', Download)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as AppData
        importBackup(parsed)
        showToast('Backup importado correctamente', Upload)
      } catch {
        showToast('El archivo no es un backup válido', XCircle)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleClearAll() {
    if (confirm('¿Seguro que quieres borrar todos tus datos? Esta acción no se puede deshacer.')) {
      clearAll()
      showToast('Datos eliminados', Trash2)
    }
  }

  function handleLoadDemo() {
    loadDemo()
    showToast('Datos demo cargados', Sparkles)
  }

  function handleSaveBudget(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(draftBudget)
    if (!value || value <= 0) return
    updateBudget(value)
    showToast('Presupuesto actualizado', Check)
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-deep-darker/60 rounded-2xl p-5 space-y-3">
        <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
          <Wallet size={20} className="text-accent-light" /> Presupuesto mensual de gastos hormiga
        </h3>
        <p className="text-xs text-muted">
          Este monto define la "vida de tu billetera": actualmente es {formatCLP(data.settings.monthlyAntBudget)}.
        </p>
        <form onSubmit={handleSaveBudget} className="flex gap-2">
          <CurrencyInput
            value={draftBudget}
            onChange={setDraftBudget}
            placeholder="150.000"
            className="flex-1 bg-card-alt border border-accent-soft/40 rounded-lg px-3 py-2 text-sm text-ink placeholder-muted focus:outline-none focus:border-accent-light"
          />
          <button
            type="submit"
            className="bg-accent hover:bg-accent-light text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
          >
            <Check size={16} /> Guardar
          </button>
        </form>
      </div>

      <div className="bg-card border border-deep-darker/60 rounded-2xl p-5 space-y-3">
        <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
          <Settings size={20} className="text-accent-light" /> Datos
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportExpensesToCSV(data.expenses)}
            className="bg-accent-soft hover:bg-accent text-white text-sm font-medium px-3 py-2 rounded-lg flex items-center gap-1.5"
          >
            <FileText size={16} /> Exportar gastos CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="bg-accent-soft hover:bg-accent text-white text-sm font-medium px-3 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Download size={16} /> Exportar backup JSON
          </button>
          <button
            onClick={handleImportClick}
            className="bg-accent-soft hover:bg-accent text-white text-sm font-medium px-3 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Upload size={16} /> Importar backup
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChange} className="hidden" />
          <button
            onClick={handleLoadDemo}
            className="bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Sparkles size={16} /> Cargar demo
          </button>
          <button
            onClick={handleClearAll}
            className="bg-danger hover:bg-danger-dark text-white text-sm font-medium px-3 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Trash2 size={16} /> Limpiar datos
          </button>
        </div>
      </div>
    </div>
  )
}
