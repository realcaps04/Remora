import { House, LayoutGrid, MessageSquarePlus, Settings } from 'lucide-react'
import type { Tab } from '../../types'
import { cn } from '../../lib/cn'

const ITEMS = [
  { id: 'home' as const, label: 'Home', Icon: House, kind: 'tab' as const },
  { id: 'devices' as const, label: 'Devices', Icon: LayoutGrid, kind: 'tab' as const },
  { id: 'request' as const, label: 'Request', Icon: MessageSquarePlus, kind: 'action' as const },
  { id: 'settings' as const, label: 'Settings', Icon: Settings, kind: 'tab' as const },
]

const TAB_INDEX: Record<Tab, number> = {
  home: 0,
  devices: 1,
  settings: 3,
}

export function BottomNavigation({
  tab,
  requestOpen,
  onChange,
  onRequest,
}: {
  tab: Tab
  requestOpen?: boolean
  onChange: (tab: Tab) => void
  onRequest: () => void
}) {
  const activeIndex = requestOpen ? 2 : TAB_INDEX[tab]

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
        {ITEMS.map((item) => {
          const active = item.kind === 'tab' ? tab === item.id && !requestOpen : Boolean(requestOpen)
          return (
            <li key={item.id} className="relative z-[1]">
              <button
                type="button"
                onClick={() => (item.kind === 'action' ? onRequest() : onChange(item.id))}
                className={cn(
                  'focus-ring nav-tab mx-auto flex w-full flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[10px] tracking-wide',
                  active ? 'is-active text-white' : 'text-[#8e8e93]',
                )}
                aria-current={item.kind === 'tab' && active ? 'page' : undefined}
                aria-expanded={item.kind === 'action' ? requestOpen : undefined}
              >
                <item.Icon size={22} strokeWidth={active ? 1.9 : 1.6} />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
