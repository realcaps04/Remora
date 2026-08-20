import { useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
  onFocus,
  autoFocus,
  placeholder = 'Search devices, rooms, brands',
}: {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  autoFocus?: boolean
  placeholder?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!autoFocus) return
    const id = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(id)
  }, [autoFocus])

  return (
    <label className="flex items-center gap-3 rounded-2xl bg-[#161618] px-4 py-3 text-[#8e8e93]">
      <Search size={18} strokeWidth={1.7} />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-[#636366]"
        aria-label="Search"
        autoFocus={autoFocus}
      />
    </label>
  )
}
