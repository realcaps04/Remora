import type { DeviceType } from '../types'

export type FanLayout = 'cycle' | 'numbered' | 'withLight' | 'learned'

export type IrProfile = {
  id: string
  type: DeviceType
  brand: string
  name: string
  hint: string
  layout: FanLayout
  maxSpeed: 3 | 5
  extras: Array<'timer' | 'oscillation' | 'light' | 'reverse'>
}

const ORIENT_FAN: IrProfile[] = [
  {
    id: 'orient-fan-3speed',
    type: 'fan',
    brand: 'Orient',
    name: '3-speed + Off',
    hint: 'Most Orient ceiling fans',
    layout: 'numbered',
    maxSpeed: 3,
    extras: ['timer'],
  },
  {
    id: 'orient-fan-5speed',
    type: 'fan',
    brand: 'Orient',
    name: '5-speed + Off',
    hint: 'Newer Orient remotes',
    layout: 'numbered',
    maxSpeed: 5,
    extras: ['timer'],
  },
  {
    id: 'orient-fan-cycle',
    type: 'fan',
    brand: 'Orient',
    name: 'Speed + / −',
    hint: 'Rocker or cycle remote',
    layout: 'cycle',
    maxSpeed: 5,
    extras: ['oscillation'],
  },
  {
    id: 'orient-fan-light',
    type: 'fan',
    brand: 'Orient',
    name: 'Fan + light',
    hint: 'Ceiling fan with lamp',
    layout: 'withLight',
    maxSpeed: 3,
    extras: ['light', 'timer'],
  },
  {
    id: 'orient-fan-reverse',
    type: 'fan',
    brand: 'Orient',
    name: 'Timer + reverse',
    hint: 'Premium Orient kits',
    layout: 'numbered',
    maxSpeed: 3,
    extras: ['timer', 'reverse'],
  },
]

function genericFanSets(brand: string): IrProfile[] {
  const slug = brand.toLowerCase().replace(/\s+/g, '-')
  return [
    {
      id: `${slug}-fan-3speed`,
      type: 'fan',
      brand,
      name: '3-speed + Off',
      hint: `Common ${brand} ceiling fan`,
      layout: 'numbered',
      maxSpeed: 3,
      extras: ['timer'],
    },
    {
      id: `${slug}-fan-5speed`,
      type: 'fan',
      brand,
      name: '5-speed + Off',
      hint: `Alternate ${brand} remote`,
      layout: 'numbered',
      maxSpeed: 5,
      extras: ['timer'],
    },
    {
      id: `${slug}-fan-cycle`,
      type: 'fan',
      brand,
      name: 'Speed + / −',
      hint: 'Rocker or cycle remote',
      layout: 'cycle',
      maxSpeed: 5,
      extras: ['oscillation'],
    },
    {
      id: `${slug}-fan-light`,
      type: 'fan',
      brand,
      name: 'Fan + light',
      hint: 'Fan with lamp button',
      layout: 'withLight',
      maxSpeed: 3,
      extras: ['light', 'timer'],
    },
  ]
}

function genericSets(type: DeviceType, brand: string): IrProfile[] {
  const slug = `${brand.toLowerCase().replace(/\s+/g, '-')}-${type}`
  return [1, 2, 3, 4].map((n) => ({
    id: `${slug}-${n}`,
    type,
    brand,
    name: `Code set ${n}`,
    hint: `Alternate ${brand} signal`,
    layout: 'cycle' as const,
    maxSpeed: 5 as const,
    extras: [] as IrProfile['extras'],
  }))
}

export function learnedProfile(type: DeviceType, brand: string): IrProfile {
  return {
    id: `learned:${type}:${brand.toLowerCase()}`,
    type,
    brand,
    name: 'Learned remote',
    hint: 'Captured from your original remote',
    layout: 'learned',
    maxSpeed: 3,
    extras: ['timer', 'light'],
  }
}

export function profilesFor(type: DeviceType, brand: string): IrProfile[] {
  if (type === 'fan' && brand === 'Orient') return ORIENT_FAN
  if (type === 'fan' || type === 'cooler') return genericFanSets(brand)
  return genericSets(type, brand)
}

export function profileById(id: string | undefined, type: DeviceType, brand: string): IrProfile {
  const all = [...profilesFor(type, brand), learnedProfile(type, brand)]
  return all.find((p) => p.id === id) ?? all[0]
}

export function nextProfile(currentId: string | undefined, type: DeviceType, brand: string): IrProfile {
  const list = profilesFor(type, brand)
  const i = Math.max(0, list.findIndex((p) => p.id === currentId))
  return list[(i + 1) % list.length]
}
