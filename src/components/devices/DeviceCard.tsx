import type { ReactNode } from 'react'
import { ChevronRight, Star } from 'lucide-react'
import type { Device } from '../../types'
import { DeviceIcon } from './DeviceIcon'
import { DeviceStatusBadge } from './DeviceStatus'
import { cn } from '../../lib/cn'

export function DeviceCard({
  device,
  room,
  onClick,
}: {
  device: Device
  room?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex w-full items-center gap-3 rounded-2xl bg-[#111113] px-3.5 py-3.5 text-left active:scale-[0.99]"
    >
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1c1c1e] text-white">
        <DeviceIcon type={device.type} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[16px] font-medium tracking-tight">{device.name}</span>
          {device.favorite ? <Star size={12} className="fill-white text-white" /> : null}
        </span>
        <DeviceStatusBadge status={device.status} />
        {room ? <span className="mt-0.5 block text-[12px] text-[#636366]">{room}</span> : null}
      </span>
      <ChevronRight size={16} className="text-[#636366]" />
    </button>
  )
}

export function RoomCard({
  name,
  summary,
  onClick,
}: {
  name: string
  summary: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring w-full rounded-2xl bg-[#111113] px-4 py-4 text-left active:scale-[0.99]"
    >
      <div className="text-[18px] font-medium tracking-tight">{name}</div>
      <div className="mt-1 text-[13px] text-[#8e8e93]">{summary}</div>
    </button>
  )
}

export function CategoryTile({
  label,
  hint,
  icon,
  count,
  onClick,
}: {
  label: string
  hint: string
  icon: ReactNode
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'focus-ring flex flex-col items-start gap-4 rounded-[22px] bg-[#111113] px-4 py-4 text-left active:scale-[0.98]',
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-full mat-static text-white">{icon}</span>
      <span>
        <span className="block text-[16px] font-medium tracking-tight">{label}</span>
        <span className="mt-0.5 block text-[12px] text-[#8e8e93]">
          {count > 0 ? `${count} device${count === 1 ? '' : 's'}` : hint}
        </span>
      </span>
    </button>
  )
}
