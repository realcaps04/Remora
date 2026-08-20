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
  const activeIndex = Math.max(0, ITEMS.findIndex((item) => item.id === tab))

  return (
    <nav
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3"
      style={{ paddingBottom: 'max(28px, calc(env(safe-area-inset-bottom) + 18px))' }}
      aria-label="Primary"
    >
      <ul className="nav-frost pointer-events-auto relative grid grid-cols-4 px-1.5 py-1.5">
        <li
          aria-hidden
          className="nav-indicator pointer-events-none absolute top-1.5 bottom-1.5 left-1.5"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
        {ITEMS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <li key={id} className="relative z-[1]">
              <button
                type="button"
                onClick={() => onChange(id)}
                className={cn(
                  'focus-ring nav-tab mx-auto flex w-full flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[10px] tracking-wide',
                  active ? 'is-active text-white' : 'text-[#8e8e93]',
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
