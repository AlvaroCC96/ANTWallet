import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Check, type LucideProps } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  icon?: React.ComponentType<LucideProps>
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export function Select({ value, onChange, options, placeholder, className }: SelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-card-alt border border-accent-soft/40 rounded-lg pl-3 pr-2 py-2 text-sm text-white text-left flex items-center justify-between gap-2 focus:outline-none focus:border-accent-light hover:border-accent-soft/70 transition-colors"
      >
        <span className={`flex items-center gap-2 truncate ${selected ? '' : 'text-gray-500'}`}>
          {selected?.icon && <selected.icon size={16} className="text-accent-light shrink-0" />}
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-20 mt-1.5 w-full max-h-60 overflow-y-auto bg-card-alt border border-accent-soft/50 rounded-lg shadow-xl py-1"
          >
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    isSelected ? 'text-accent-light bg-accent/10' : 'text-gray-200 hover:bg-deep-darker/60'
                  }`}
                >
                  {option.icon && <option.icon size={16} className="shrink-0" />}
                  <span className="truncate flex-1">{option.label}</span>
                  {isSelected && <Check size={14} className="shrink-0" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
