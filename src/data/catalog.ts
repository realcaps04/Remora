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

export const BRANDS = [
  'Samsung',
  'LG',
  'Sony',
  'Tata Play',
  'Airtel',
  'Dish TV',
  'Voltas',
  'O General',
  'Panasonic',
  'Philips',
  'Havells',
  'Crompton',
  'Daikin',
  'Hisense',
  'TCL',
  'JBL',
  'Bose',
  'Xiaomi',
  'Other Brand',
]

export function categoryLabel(type: DeviceType) {
  return CATEGORIES.find((c) => c.type === type)?.label ?? 'Device'
}
