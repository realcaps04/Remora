import { Search } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
  onFocus,
  placeholder = 'Search devices, rooms, brands',
}: {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  placeholder?: string
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl bg-[#161618] px-4 py-3 text-[#8e8e93]">
      <Search size={18} strokeWidth={1.7} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-[#636366]"
        aria-label="Search"
      />
    </label>
  )
}
