import { formatThousands, onlyDigits } from '../utils/currency'

interface CurrencyInputProps {
  value: string
  onChange: (digits: string) => void
  placeholder?: string
  className?: string
}

export function CurrencyInput({ value, onChange, placeholder, className }: CurrencyInputProps) {
  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={formatThousands(value)}
      onChange={(e) => onChange(onlyDigits(e.target.value))}
      className={className}
    />
  )
}
