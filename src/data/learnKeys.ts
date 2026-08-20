import type { DeviceType } from '../types'

export type LearnKey = {
  id: string
  label: string
  command: string
  value?: number
  required: boolean
}

const TV_KEYS: LearnKey[] = [
  { id: 'power', label: 'Power', command: 'power', required: true },
  { id: 'volumeUp', label: 'Volume +', command: 'volumeUp', required: true },
  { id: 'volumeDown', label: 'Volume −', command: 'volumeDown', required: true },
  { id: 'mute', label: 'Mute', command: 'mute', required: false },
  { id: 'up', label: 'Up', command: 'up', required: false },
  { id: 'down', label: 'Down', command: 'down', required: false },
  { id: 'left', label: 'Left', command: 'left', required: false },
  { id: 'right', label: 'Right', command: 'right', required: false },
  { id: 'ok', label: 'OK', command: 'ok', required: false },
  { id: 'back', label: 'Back', command: 'back', required: false },
  { id: 'home', label: 'Home', command: 'home', required: false },
  { id: 'playPause', label: 'Play / Pause', command: 'playPause', required: false },
]

const FAN_KEYS: LearnKey[] = [
  { id: 'on', label: 'On', command: 'powerOn', required: true },
  { id: 'off', label: 'Off', command: 'powerOff', required: true },
  { id: 'speed1', label: 'Speed 1', command: 'setSpeed', value: 1, required: true },
  { id: 'speed2', label: 'Speed 2', command: 'setSpeed', value: 2, required: true },
  { id: 'speed3', label: 'Speed 3', command: 'setSpeed', value: 3, required: true },
  { id: 'speed4', label: 'Speed 4', command: 'setSpeed', value: 4, required: false },
  { id: 'speed5', label: 'Speed 5', command: 'setSpeed', value: 5, required: false },
  { id: 'timer', label: 'Timer', command: 'timer', required: false },
  { id: 'light', label: 'Light', command: 'fanLight', required: false },
  { id: 'reverse', label: 'Reverse', command: 'reverse', required: false },
  { id: 'sleep', label: 'Sleep', command: 'sleep', required: false },
]

const AC_KEYS: LearnKey[] = [
  { id: 'power', label: 'Power', command: 'power', required: true },
  { id: 'tempUp', label: 'Temp +', command: 'tempUp', required: true },
  { id: 'tempDown', label: 'Temp −', command: 'tempDown', required: true },
  { id: 'acMode', label: 'Mode', command: 'acMode', required: false },
  { id: 'acFan', label: 'Fan speed', command: 'acFan', required: false },
  { id: 'swing', label: 'Swing', command: 'swing', required: false },
  { id: 'sleep', label: 'Sleep', command: 'sleep', required: false },
  { id: 'turbo', label: 'Turbo', command: 'turbo', required: false },
]

const DTH_KEYS: LearnKey[] = [
  { id: 'power', label: 'Power', command: 'power', required: true },
  { id: 'channelUp', label: 'Channel +', command: 'channelUp', required: true },
  { id: 'channelDown', label: 'Channel −', command: 'channelDown', required: true },
  { id: 'ok', label: 'OK', command: 'ok', required: false },
  { id: 'back', label: 'Back', command: 'back', required: false },
  { id: 'guide', label: 'Guide', command: 'guide', required: false },
  { id: 'mute', label: 'Mute', command: 'mute', required: false },
  { id: 'volumeUp', label: 'Volume +', command: 'volumeUp', required: false },
  { id: 'volumeDown', label: 'Volume −', command: 'volumeDown', required: false },
]

const AUDIO_KEYS: LearnKey[] = [
  { id: 'power', label: 'Power', command: 'power', required: true },
  { id: 'volumeUp', label: 'Volume +', command: 'volumeUp', required: true },
  { id: 'volumeDown', label: 'Volume −', command: 'volumeDown', required: true },
  { id: 'mute', label: 'Mute', command: 'mute', required: false },
  { id: 'input', label: 'Input', command: 'input', required: false },
  { id: 'playPause', label: 'Play / Pause', command: 'playPause', required: false },
]

const LIGHT_KEYS: LearnKey[] = [
  { id: 'power', label: 'Power', command: 'power', required: true },
  { id: 'brightnessUp', label: 'Brighter', command: 'brightnessUp', required: false },
  { id: 'brightnessDown', label: 'Dimmer', command: 'brightnessDown', required: false },
]

const PLUG_KEYS: LearnKey[] = [{ id: 'power', label: 'Power', command: 'power', required: true }]

const GENERIC_KEYS: LearnKey[] = [
  { id: 'power', label: 'Power', command: 'power', required: true },
  { id: 'volumeUp', label: 'Volume +', command: 'volumeUp', required: false },
  { id: 'volumeDown', label: 'Volume −', command: 'volumeDown', required: false },
]

export function learnKeysFor(type: DeviceType): LearnKey[] {
  if (type === 'fan' || type === 'cooler') return FAN_KEYS
  if (type === 'tv' || type === 'projector') return TV_KEYS
  if (type === 'ac') return AC_KEYS
  if (type === 'dth') return DTH_KEYS
  if (type === 'soundbar' || type === 'speaker' || type === 'hometheatre') return AUDIO_KEYS
  if (type === 'light' || type === 'lamp') return LIGHT_KEYS
  if (type === 'plug') return PLUG_KEYS
  return GENERIC_KEYS
}
