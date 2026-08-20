import type { LucideIcon } from 'lucide-react'
import {
  AirVent,
  Box,
  Clapperboard,
  Fan,
  Lamp,
  Lightbulb,
  Monitor,
  Plug,
  Projector,
  Radio,
  Gamepad2,
  Speaker,
  Tv,
  Wind,
} from 'lucide-react'
import type { DeviceType } from '../../types'
import { cn } from '../../lib/cn'

const MAP: Record<DeviceType, LucideIcon> = {
  tv: Tv,
  dth: Radio,
  fan: Fan,
  ac: AirVent,
  soundbar: Speaker,
  speaker: Speaker,
  hometheatre: Clapperboard,
  projector: Projector,
  light: Lightbulb,
  lamp: Lamp,
  plug: Plug,
  cooler: Wind,
  custom: Gamepad2,
  other: Box,
}

export function DeviceIcon({
  type,
  className,
  size = 20,
}: {
  type: DeviceType
  className?: string
  size?: number
}) {
  const Icon = MAP[type] ?? Monitor
  return <Icon size={size} strokeWidth={1.6} className={cn('shrink-0', className)} />
}
