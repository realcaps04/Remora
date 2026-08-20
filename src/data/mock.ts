import type { ActivityEvent, Device, QuickAction, Room, Scene } from '../types'
import { defaultDeviceState } from './defaults'

const now = Date.now()
const minutes = (n: number) => now - n * 60_000

function state(partial: Partial<ReturnType<typeof defaultDeviceState>>) {
  return { ...defaultDeviceState(), ...partial }
}

export const rooms: Room[] = [
  { id: 'living', name: 'Living Room' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'kitchen', name: 'Kitchen' },
]

export const devices: Device[] = [
  {
    id: 'living-tv',
    name: 'Samsung TV',
    brand: 'Samsung',
    type: 'tv',
    roomId: 'living',
    connectionType: 'ir',
    status: 'connected',
    favorite: true,
    lastUsedAt: minutes(5),
    state: state({ power: true, volume: 22, channel: 108, source: 'HDMI 1' }),
  },
  {
    id: 'living-dth',
    name: 'Tata Play',
    brand: 'Tata Play',
    type: 'dth',
    roomId: 'living',
    connectionType: 'ir',
    status: 'connected',
    favorite: true,
    lastUsedAt: minutes(19),
    state: state({ power: true, channel: 102, volume: 16 }),
  },
  {
    id: 'living-fan',
    name: 'Ceiling Fan',
    brand: 'Havells',
    type: 'fan',
    roomId: 'living',
    connectionType: 'ir',
    status: 'connected',
    favorite: false,
    lastUsedAt: minutes(20),
    state: state({ power: true, speed: 2, oscillation: true }),
  },
  {
    id: 'living-soundbar',
    name: 'Sony Soundbar',
    brand: 'Sony',
    type: 'soundbar',
    roomId: 'living',
    connectionType: 'bluetooth',
    status: 'connected',
    favorite: false,
    lastUsedAt: minutes(41),
    state: state({ power: true, volume: 14, bass: 2, treble: 1, input: 'HDMI ARC' }),
  },
  {
    id: 'bed-tv',
    name: 'LG TV',
    brand: 'LG',
    type: 'tv',
    roomId: 'bedroom',
    connectionType: 'ir',
    status: 'connected',
    favorite: false,
    lastUsedAt: minutes(180),
    state: state({ power: false, volume: 12 }),
  },
  {
    id: 'bed-ac',
    name: 'Voltas AC',
    brand: 'Voltas',
    type: 'ac',
    roomId: 'bedroom',
    connectionType: 'ir',
    status: 'connected',
    favorite: true,
    lastUsedAt: minutes(87),
    state: state({ power: true, temperature: 24, acMode: 'cool', acFan: 'auto' }),
  },
  {
    id: 'bed-fan',
    name: 'Bedroom Fan',
    brand: 'Crompton',
    type: 'fan',
    roomId: 'bedroom',
    connectionType: 'ir',
    status: 'connected',
    favorite: true,
    lastUsedAt: minutes(20),
    state: state({ power: true, speed: 3, oscillation: false }),
  },
  {
    id: 'kit-light',
    name: 'Philips Light',
    brand: 'Philips',
    type: 'light',
    roomId: 'kitchen',
    connectionType: 'wifi',
    status: 'connected',
    favorite: false,
    lastUsedAt: minutes(240),
    state: state({ power: false, brightness: 0 }),
  },
  {
    id: 'kit-plug',
    name: 'Smart Plug',
    brand: 'Xiaomi',
    type: 'plug',
    roomId: 'kitchen',
    connectionType: 'wifi',
    status: 'offline',
    favorite: false,
    lastUsedAt: minutes(1440),
    state: state({ power: false }),
  },
]

export const scenes: Scene[] = [
  {
    id: 'movie-night',
    name: 'Movie Night',
    description: 'TV, DTH and soundbar on. Lights dimmed.',
    favorite: true,
    actions: [
      { deviceId: 'living-tv', command: 'powerOn' },
      { deviceId: 'living-dth', command: 'powerOn' },
      { deviceId: 'living-soundbar', command: 'powerOn' },
      { deviceId: 'kit-light', command: 'setBrightness', value: 20 },
      { deviceId: 'living-fan', command: 'setSpeed', value: 2 },
    ],
  },
  {
    id: 'good-night',
    name: 'Good Night',
    description: 'Everything winds down for sleep.',
    favorite: false,
    actions: [
      { deviceId: 'living-tv', command: 'powerOff' },
      { deviceId: 'living-dth', command: 'powerOff' },
      { deviceId: 'kit-light', command: 'powerOff' },
      { deviceId: 'bed-fan', command: 'setSpeed', value: 1 },
    ],
  },
  {
    id: 'good-morning',
    name: 'Good Morning',
    description: 'Lights and fan on. Screens stay off.',
    favorite: false,
    actions: [
      { deviceId: 'kit-light', command: 'powerOn' },
      { deviceId: 'living-fan', command: 'powerOn' },
      { deviceId: 'living-tv', command: 'powerOff' },
    ],
  },
]

export const quickActions: QuickAction[] = [
  { id: 'qa-tv-power', deviceId: 'living-tv', command: 'power', label: 'Power', favorite: true },
  { id: 'qa-fan-speed', deviceId: 'living-fan', command: 'speedUp', label: 'Speed', favorite: true },
  { id: 'qa-ac-temp', deviceId: 'bed-ac', command: 'tempUp', label: 'Temp', favorite: false },
  { id: 'qa-lights', deviceId: 'kit-light', command: 'power', label: 'Lights', favorite: false },
]

export const activity: ActivityEvent[] = [
  { id: 'a1', deviceId: 'living-tv', message: 'TV powered on', timestamp: minutes(5) },
  { id: 'a2', deviceId: 'living-fan', message: 'Living Room Fan → Speed 3', timestamp: minutes(12) },
  { id: 'a3', deviceId: 'bed-ac', message: 'AC → 24°C', timestamp: minutes(87) },
  { id: 'a4', deviceId: 'living-dth', message: 'DTH → Channel 102', timestamp: minutes(104) },
]
