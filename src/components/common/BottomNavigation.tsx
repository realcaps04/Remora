import { Clock3, House, LayoutGrid, Settings, Sparkles } from 'lucide-react'
import type { Tab } from '../../types'
import { cn } from '../../lib/cn'

const ITEMS: { id: Tab; label: string; Icon: typeof House }[] = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'devices', label: 'Devices', Icon: LayoutGrid },
  { id: 'scenes', label: 'Scenes', Icon: Sparkles },
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
      className="absolute inset-x-0 bottom-0 z-30 border-t border-white/5 bg-black/90 px-2 pt-2 backdrop-blur-md"
      style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
      aria-label="Primary"
    >
      <ul className="flex items-end justify-between">
        {ITEMS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                className={cn(
                  'focus-ring mx-auto flex w-full flex-col items-center gap-1 rounded-xl py-1 text-[10px] tracking-wide',
                  active ? 'text-white' : 'text-[#636366]',
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
