import { Clock3, House, LayoutGrid, Settings } from 'lucide-react'
import type { Tab } from '../../types'
import { cn } from '../../lib/cn'

const ITEMS: { id: Tab; label: string; Icon: typeof House }[] = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'devices', label: 'Devices', Icon: LayoutGrid },
  { id: 'activity', label: 'Activity', Icon: Clock3 },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export function BottomNavigation({
  tab,
  onChange,
}: {
  tab: Tab
  onChange: (tab: Tab) => void
}) {
  return (
    <nav
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      aria-label="Primary"
    >
      <ul className="nav-frost pointer-events-auto flex items-center justify-between px-1.5 py-1.5">
        {ITEMS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                className={cn(
                  'focus-ring mx-auto flex w-full flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[10px] tracking-wide transition-colors',
                  active ? 'bg-white/10 text-white' : 'text-[#8e8e93]',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={22} strokeWidth={active ? 1.9 : 1.6} />
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
