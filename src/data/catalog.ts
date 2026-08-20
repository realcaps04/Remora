import type { DeviceGroup, DeviceType } from '../types'
import { DeviceType as Types } from '../types'

export type CategoryDef = {
  type: DeviceType
  label: string
  group: DeviceGroup
  hint: string
}

export const CATEGORIES: CategoryDef[] = [
  { type: Types.TV, label: 'TV', group: 'entertainment', hint: 'Television' },
  { type: Types.DTH, label: 'DTH', group: 'entertainment', hint: 'Set-top box' },
  { type: Types.Soundbar, label: 'Soundbar', group: 'entertainment', hint: 'Audio bar' },
  { type: Types.Speaker, label: 'Speaker', group: 'entertainment', hint: 'Wireless speaker' },
  { type: Types.HomeTheatre, label: 'Home Theatre', group: 'entertainment', hint: 'Surround system' },
  { type: Types.Projector, label: 'Projector', group: 'entertainment', hint: 'Cinema display' },
  { type: Types.Fan, label: 'Fan', group: 'climate', hint: 'Ceiling fan' },
  { type: Types.AC, label: 'AC', group: 'climate', hint: 'Air conditioner' },
  { type: Types.Cooler, label: 'Air Cooler', group: 'climate', hint: 'Evaporative cooler' },
  { type: Types.Light, label: 'Lights', group: 'lighting', hint: 'Room lighting' },
  { type: Types.Lamp, label: 'Lamps', group: 'lighting', hint: 'Table lamp' },
  { type: Types.Plug, label: 'Smart Plug', group: 'lighting', hint: 'Power outlet' },
  { type: Types.Custom, label: 'Custom Remote', group: 'other', hint: 'Learn buttons' },
  { type: Types.Other, label: 'Other Device', group: 'other', hint: 'Universal IR' },
]

export const GROUP_LABEL: Record<DeviceGroup, string> = {
  entertainment: 'Entertainment',
  climate: 'Climate',
  lighting: 'Lighting',
  other: 'Other',
}

export const CONNECTION_OPTIONS = [
  {
    id: 'ir' as const,
    title: 'Infrared',
    body: 'Control traditional IR devices.',
  },
  {
    id: 'wifi' as const,
    title: 'Wi-Fi',
    body: 'Connect compatible smart devices.',
  },
  {
    id: 'bluetooth' as const,
    title: 'Bluetooth',
    body: 'Connect supported nearby devices.',
  },
  {
    id: 'smarthome' as const,
    title: 'Smart Home',
    body: 'Future smart-home integrations.',
  },
]

const OTHER = 'Other Brand'

const BRANDS_BY_TYPE: Record<DeviceType, readonly string[]> = {
  tv: ['Samsung', 'LG', 'Sony', 'Panasonic', 'Philips', 'Hisense', 'TCL', 'Xiaomi', 'OnePlus', 'Vu', 'Thomson', 'Sansui', OTHER],
  projector: ['Epson', 'BenQ', 'Sony', 'ViewSonic', 'XGIMI', 'Panasonic', 'Samsung', OTHER],
  dth: ['Tata Play', 'Airtel', 'Dish TV', 'd2h', 'Sun Direct', 'Jio', OTHER],
  soundbar: ['JBL', 'Bose', 'Sony', 'Samsung', 'LG', 'Boat', 'Xiaomi', 'Philips', 'Hisense', OTHER],
  speaker: ['JBL', 'Bose', 'Sony', 'Boat', 'Xiaomi', 'Philips', 'Samsung', OTHER],
  hometheatre: ['Sony', 'Samsung', 'LG', 'Philips', 'JBL', 'Bose', OTHER],
  fan: ['Havells', 'Crompton', 'Orient', 'Colorbot', 'Usha', 'Atomberg', 'Bajaj', 'Superfan', 'Panasonic', 'Philips', OTHER],
  cooler: ['Symphony', 'Bajaj', 'Crompton', 'Orient', 'Havells', 'Kenstar', OTHER],
  ac: ['Voltas', 'Daikin', 'O General', 'Samsung', 'LG', 'Panasonic', 'Hitachi', 'Blue Star', 'Lloyd', 'Carrier', 'Whirlpool', 'Godrej', OTHER],
  light: ['Philips', 'Syska', 'Wipro', 'Xiaomi', 'Orient', 'Havells', 'Crompton', OTHER],
  lamp: ['Philips', 'Syska', 'Wipro', 'Xiaomi', 'Orient', 'Havells', OTHER],
  plug: ['Xiaomi', 'Wipro', 'Amazon', 'TP-Link', 'Syska', OTHER],
  custom: [OTHER, 'Universal'],
  other: ['Samsung', 'LG', 'Sony', 'Panasonic', 'Philips', 'Xiaomi', OTHER],
}

export const BRANDS = unique(Object.values(BRANDS_BY_TYPE).flat())

export function brandsFor(type: DeviceType) {
  return [...(BRANDS_BY_TYPE[type] ?? BRANDS_BY_TYPE.other)]
}

function unique(items: string[]) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of items) {
    if (seen.has(item)) continue
    seen.add(item)
    out.push(item)
  }
  return out
}

export function categoryLabel(type: DeviceType) {
  return CATEGORIES.find((c) => c.type === type)?.label ?? 'Device'
}
