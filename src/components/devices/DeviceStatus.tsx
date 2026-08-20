import type { DeviceStatus } from '../../types'
import { cn } from '../../lib/cn'

const LABEL: Record<DeviceStatus, string> = {
  connected: 'Connected',
  connecting: 'Connecting',
  offline: 'Offline',
  disconnected: 'Disconnected',
  unknown: 'Unknown',
}

export function DeviceStatusBadge({
  status,
  className,
}: {
  status: DeviceStatus
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[12px] text-[#8e8e93]', className)}>
      <span className={cn('status-dot', status)} aria-hidden />
      {LABEL[status]}
    </span>
  )
}
