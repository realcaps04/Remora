export const ConnectionType = {
  Infrared: 'ir',
  Wifi: 'wifi',
  Bluetooth: 'bluetooth',
  SmartHome: 'smarthome',
} as const
export type ConnectionType = (typeof ConnectionType)[keyof typeof ConnectionType]

export const DeviceStatus = {
  Connected: 'connected',
  Connecting: 'connecting',
  Offline: 'offline',
  Disconnected: 'disconnected',
  Unknown: 'unknown',
} as const
export type DeviceStatus = (typeof DeviceStatus)[keyof typeof DeviceStatus]

export const DeviceType = {
  TV: 'tv',
  DTH: 'dth',
  Fan: 'fan',
  AC: 'ac',
  Soundbar: 'soundbar',
  Speaker: 'speaker',
  HomeTheatre: 'hometheatre',
  Projector: 'projector',
  Light: 'light',
  Lamp: 'lamp',
  Plug: 'plug',
  Cooler: 'cooler',
  Custom: 'custom',
  Other: 'other',
} as const
export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType]

export const DeviceGroup = {
  Entertainment: 'entertainment',
  Climate: 'climate',
  Lighting: 'lighting',
  Other: 'other',
} as const
export type DeviceGroup = (typeof DeviceGroup)[keyof typeof DeviceGroup]

export const AcMode = {
  Cool: 'cool',
  Heat: 'heat',
  Fan: 'fan',
  Dry: 'dry',
  Auto: 'auto',
} as const
export type AcMode = (typeof AcMode)[keyof typeof AcMode]

export const AcFanSpeed = {
  Auto: 'auto',
  Low: 'low',
  Med: 'med',
  High: 'high',
} as const
export type AcFanSpeed = (typeof AcFanSpeed)[keyof typeof AcFanSpeed]

export type DeviceState = {
  power: boolean
  volume: number
  muted: boolean
  channel: number
  source: string
  playing: boolean
  speed: number
  oscillation: boolean
  fanMode: string
  timerMinutes: number
  temperature: number
  acMode: AcMode
  acFan: AcFanSpeed
  swing: boolean
  sleep: boolean
  turbo: boolean
  brightness: number
  bass: number
  treble: number
  input: string
  bluetooth: boolean
}

export type Room = {
  id: string
  name: string
}

export type Device = {
  id: string
  name: string
  brand: string
  type: DeviceType
  roomId: string
  connectionType: ConnectionType
  status: DeviceStatus
  favorite: boolean
  lastUsedAt: number
  state: DeviceState
}

export type SceneAction = {
  deviceId: string
  command: string
  value?: number | string | boolean
}

export type Scene = {
  id: string
  name: string
  description: string
  actions: SceneAction[]
  favorite: boolean
}

export type ActivityEvent = {
  id: string
  deviceId?: string
  sceneId?: string
  message: string
  timestamp: number
}

export type QuickAction = {
  id: string
  deviceId: string
  command: string
  label: string
  favorite: boolean
}

export type CommandPayload = {
  value?: number | string | boolean
}

export type CommandResult = {
  ok: boolean
  message?: string
}

export type Route =
  | { name: 'splash' }
  | { name: 'home' }
  | { name: 'devices' }
  | { name: 'category'; type: DeviceType }
  | { name: 'rooms' }
  | { name: 'room'; roomId: string }
  | { name: 'add-device'; type?: DeviceType }
  | { name: 'remote'; deviceId: string }
  | { name: 'device-settings'; deviceId: string }
  | { name: 'scenes' }
  | { name: 'activity' }
  | { name: 'favorites' }
  | { name: 'settings' }
  | { name: 'ask' }
  | { name: 'search' }

export type Tab = 'home' | 'devices' | 'scenes' | 'activity' | 'settings'
