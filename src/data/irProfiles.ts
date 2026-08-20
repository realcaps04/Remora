import type { DeviceType } from '../types'

export type RemoteLayout =
  | 'fan-numbered'
  | 'fan-cycle'
  | 'fan-light'
  | 'tv-standard'
  | 'tv-smart'
  | 'tv-basic'
  | 'ac-split'
  | 'ac-inverter'
  | 'ac-window'
  | 'dth-standard'
  | 'dth-hd'
  | 'audio-full'
  | 'audio-mini'
  | 'light-dimmer'
  | 'light-toggle'
  | 'plug-toggle'
  | 'learn'
  | 'generic'

export type RemoteExtra = 'timer' | 'oscillation' | 'light' | 'reverse' | 'turbo' | 'swing' | 'sleep'

export type IrProfile = {
  id: string
  type: DeviceType
  brand: string
  name: string
  hint: string
  layout: RemoteLayout
  maxSpeed: 3 | 5
  extras: RemoteExtra[]
}

type Way = {
  key: string
  name: string
  hint: string
  layout: RemoteLayout
  maxSpeed?: 3 | 5
  extras?: RemoteExtra[]
}

const FAN_WAYS: Way[] = [
  { key: '5speed', name: '5-speed + Off', hint: 'Newer {brand} remotes, including BLDC', layout: 'fan-numbered', maxSpeed: 5, extras: ['timer'] },
  { key: '3speed', name: '3-speed + Off', hint: 'Most {brand} ceiling fans', layout: 'fan-numbered', maxSpeed: 3, extras: ['timer'] },
  { key: 'cycle', name: 'Speed + / −', hint: 'Rocker or cycle remote', layout: 'fan-cycle', maxSpeed: 5, extras: ['oscillation'] },
  { key: 'light', name: 'Fan + light', hint: 'Ceiling fan with lamp', layout: 'fan-light', maxSpeed: 3, extras: ['light', 'timer'] },
  { key: 'reverse', name: 'Timer + reverse', hint: 'Premium {brand} kits', layout: 'fan-numbered', maxSpeed: 3, extras: ['timer', 'reverse'] },
  { key: 'breeze', name: 'Breeze / swing', hint: 'Oscillating pedestal or BLDC', layout: 'fan-cycle', maxSpeed: 5, extras: ['oscillation', 'timer'] },
  { key: 'rf', name: 'RF remote', hint: '2.4 GHz kit — try if IR does nothing', layout: 'fan-numbered', maxSpeed: 3, extras: ['timer'] },
]

const COOLER_WAYS: Way[] = [
  { key: '3speed', name: '3-speed + Off', hint: 'Common {brand} cooler', layout: 'fan-numbered', maxSpeed: 3, extras: ['timer'] },
  { key: 'cycle', name: 'Speed + / −', hint: 'Rocker cooler remote', layout: 'fan-cycle', maxSpeed: 5, extras: ['oscillation'] },
  { key: 'pump', name: 'Cooler + pump', hint: 'Fan, swing, and water pump', layout: 'fan-cycle', maxSpeed: 3, extras: ['oscillation', 'timer'] },
  { key: 'swing', name: 'With swing', hint: 'Honeycomb cooler with louvers', layout: 'fan-numbered', maxSpeed: 3, extras: ['oscillation', 'timer'] },
]

const TV_WAYS: Way[] = [
  { key: 'standard', name: 'Standard IR', hint: 'Classic {brand} infrared', layout: 'tv-standard' },
  { key: 'smart', name: 'Smart TV', hint: 'Home, apps, and playback', layout: 'tv-smart' },
  { key: 'basic', name: 'Basic / older', hint: 'Power, volume, and channels', layout: 'tv-basic' },
  { key: 'code-a', name: 'IR code A', hint: 'NEC / most common {brand} map', layout: 'tv-standard' },
  { key: 'code-b', name: 'IR code B', hint: 'Alternate {brand} protocol', layout: 'tv-standard' },
  { key: 'code-c', name: 'IR code C', hint: 'Older 32-bit {brand} map', layout: 'tv-basic' },
  { key: 'cec', name: 'HDMI-CEC', hint: 'TV follows the HDMI device', layout: 'tv-smart' },
]

const PROJECTOR_WAYS: Way[] = [
  { key: 'standard', name: 'Standard IR', hint: 'Full {brand} projector remote', layout: 'tv-standard' },
  { key: 'basic', name: 'Power + input', hint: 'Compact projector clicker', layout: 'tv-basic' },
  { key: 'hdmi', name: 'HDMI / source', hint: 'Source-heavy {brand} map', layout: 'tv-standard' },
  { key: 'code-a', name: 'IR code A', hint: 'Primary {brand} projector code', layout: 'tv-standard' },
  { key: 'code-b', name: 'IR code B', hint: 'Alternate {brand} projector code', layout: 'tv-basic' },
]

const DTH_WAYS: Way[] = [
  { key: 'sd', name: 'Standard box', hint: 'SD / MPEG2 {brand} remote', layout: 'dth-standard' },
  { key: 'hd', name: 'HD box', hint: 'MPEG4 HD {brand} remote', layout: 'dth-hd' },
  { key: 'uhd', name: '4K / UHD box', hint: 'Newer {brand} 4K receiver', layout: 'dth-hd' },
  { key: 'code-a', name: 'IR code A', hint: 'Primary {brand} set-top code', layout: 'dth-standard' },
  { key: 'code-b', name: 'IR code B', hint: 'Alternate {brand} set-top code', layout: 'dth-hd' },
  { key: 'rf', name: 'RF remote', hint: '2.4 GHz box remote if IR fails', layout: 'dth-standard' },
]

const AUDIO_WAYS: Way[] = [
  { key: 'full', name: 'Full remote', hint: 'Power, input, mute, volume', layout: 'audio-full' },
  { key: 'mini', name: 'Mini remote', hint: 'Power and volume only', layout: 'audio-mini' },
  { key: 'arc', name: 'HDMI-ARC / CEC', hint: 'Follows the TV remote', layout: 'audio-full' },
  { key: 'bt', name: 'Bluetooth speaker', hint: 'Play / pause and volume', layout: 'audio-mini' },
  { key: 'sub', name: 'With subwoofer', hint: 'Bass and input on {brand}', layout: 'audio-full' },
  { key: 'code-a', name: 'IR code A', hint: 'Primary {brand} audio map', layout: 'audio-full' },
  { key: 'code-b', name: 'IR code B', hint: 'Alternate {brand} audio map', layout: 'audio-mini' },
]

const AC_WAYS: Way[] = [
  { key: 'split', name: 'Split AC', hint: 'Wall split {brand} IR', layout: 'ac-split', extras: ['swing', 'sleep'] },
  { key: 'inverter', name: 'Inverter', hint: 'Inverter {brand} with turbo', layout: 'ac-inverter', extras: ['turbo', 'swing', 'sleep'] },
  { key: 'window', name: 'Window / portable', hint: 'Window or portable {brand}', layout: 'ac-window' },
  { key: 'code-a', name: 'IR code A', hint: 'Most common {brand} AC map', layout: 'ac-split', extras: ['swing'] },
  { key: 'code-b', name: 'IR code B', hint: 'Alternate {brand} AC map', layout: 'ac-inverter', extras: ['turbo', 'sleep'] },
  { key: 'code-c', name: 'IR code C', hint: 'Older {brand} AC map', layout: 'ac-window' },
]

const LIGHT_WAYS: Way[] = [
  { key: 'dimmer', name: 'Dimmer', hint: 'Brightness on {brand} light', layout: 'light-dimmer' },
  { key: 'toggle', name: 'On / Off', hint: 'Simple {brand} switch', layout: 'light-toggle' },
  { key: 'cct', name: 'Warm / cool', hint: 'Tunable white {brand} lamp', layout: 'light-dimmer', extras: ['light'] },
  { key: 'rf', name: '2.4 GHz / RF', hint: 'Hub or RF bulb if IR fails', layout: 'light-dimmer' },
]

const PLUG_WAYS: Way[] = [
  { key: 'toggle', name: 'On / Off', hint: 'Simple {brand} plug', layout: 'plug-toggle' },
  { key: 'timer', name: 'Timer plug', hint: '{brand} outlet with timer', layout: 'plug-toggle', extras: ['timer'] },
  { key: 'rf', name: 'Wi-Fi / RF', hint: 'Smart plug if IR is unused', layout: 'plug-toggle' },
]

const GENERIC_WAYS: Way[] = [
  { key: 'standard', name: 'Standard IR', hint: 'Primary {brand} map', layout: 'generic' },
  { key: 'code-a', name: 'IR code A', hint: 'Alternate {brand} map A', layout: 'generic' },
  { key: 'code-b', name: 'IR code B', hint: 'Alternate {brand} map B', layout: 'generic' },
  { key: 'code-c', name: 'IR code C', hint: 'Older {brand} map', layout: 'generic' },
  { key: 'learn', name: 'Learn buttons', hint: 'Capture the original remote', layout: 'learn' },
]

const TYPE_WAYS: Record<DeviceType, Way[]> = {
  fan: FAN_WAYS,
  cooler: COOLER_WAYS,
  tv: TV_WAYS,
  projector: PROJECTOR_WAYS,
  dth: DTH_WAYS,
  soundbar: AUDIO_WAYS,
  speaker: AUDIO_WAYS,
  hometheatre: AUDIO_WAYS,
  ac: AC_WAYS,
  light: LIGHT_WAYS,
  lamp: LIGHT_WAYS,
  plug: PLUG_WAYS,
  custom: GENERIC_WAYS,
  other: GENERIC_WAYS,
}

const SPECIAL: Record<string, Way[]> = {
  'Samsung:tv': [
    { key: 'anynet', name: 'Anynet+', hint: 'Samsung HDMI-CEC', layout: 'tv-smart' },
    { key: '2016', name: '2010–2016 LED', hint: 'Older Samsung IR', layout: 'tv-standard' },
    { key: '2017', name: '2017+ Smart Hub', hint: 'Later Samsung IR', layout: 'tv-smart' },
  ],
  'LG:tv': [
    { key: 'webos', name: 'webOS / Magic', hint: 'Pointer-era LG IR', layout: 'tv-smart' },
    { key: 'oled', name: 'OLED / C-series', hint: 'Later LG TV map', layout: 'tv-smart' },
  ],
  'Sony:tv': [
    { key: 'bravia', name: 'Bravia', hint: 'Sony Bravia IR', layout: 'tv-smart' },
    { key: 'google', name: 'Google TV', hint: 'Android / Google TV Sony', layout: 'tv-smart' },
  ],
  'Xiaomi:tv': [
    { key: 'mitv', name: 'Mi TV / PatchWall', hint: 'Xiaomi smart TV IR', layout: 'tv-smart' },
    { key: 'mbox', name: 'Mi Box IR', hint: 'Stick / box over IR', layout: 'tv-basic' },
  ],
  'TCL:tv': [
    { key: 'roku', name: 'Roku TV', hint: 'TCL Roku IR', layout: 'tv-smart' },
    { key: 'google', name: 'Google TV', hint: 'TCL Google TV IR', layout: 'tv-smart' },
  ],
  'Hisense:tv': [
    { key: 'vidaa', name: 'VIDAA', hint: 'Hisense VIDAA IR', layout: 'tv-smart' },
    { key: 'roku', name: 'Roku TV', hint: 'Hisense Roku IR', layout: 'tv-smart' },
  ],
  'Tata Play:dth': [
    { key: 'tata-sd', name: 'Tata Play SD', hint: 'Classic Tata Sky IR', layout: 'dth-standard' },
    { key: 'tata-hd', name: 'Tata Play HD', hint: 'HD / plus box', layout: 'dth-hd' },
    { key: 'tata-4k', name: 'Tata Play 4K', hint: 'UHD binge box', layout: 'dth-hd' },
  ],
  'Airtel:dth': [
    { key: 'airtel-hd', name: 'Airtel HD', hint: 'Airtel digital HD', layout: 'dth-hd' },
    { key: 'airtel-4k', name: 'Airtel 4K', hint: 'Airtel internet TV / 4K', layout: 'dth-hd' },
  ],
  'Dish TV:dth': [
    { key: 'dish-sd', name: 'Dish TV SD', hint: 'Classic Dish IR', layout: 'dth-standard' },
    { key: 'dish-hd', name: 'Dish TV HD', hint: 'Zing / HD box', layout: 'dth-hd' },
  ],
  'Daikin:ac': [
    { key: 'ftx', name: 'FTX / FTK split', hint: 'Daikin wall split IR', layout: 'ac-inverter', extras: ['turbo', 'swing', 'sleep'] },
    { key: 'vrv', name: 'Multi-split', hint: 'Daikin multi indoor IR', layout: 'ac-split', extras: ['swing'] },
  ],
  'Voltas:ac': [
    { key: 'voltas-win', name: 'Voltas window', hint: 'Window AC IR', layout: 'ac-window' },
    { key: 'voltas-adj', name: 'Adjustable inverter', hint: 'Voltas adjustable IR', layout: 'ac-inverter', extras: ['turbo', 'sleep'] },
  ],
  'O General:ac': [
    { key: 'general', name: 'O General split', hint: 'Fujitsu General IR', layout: 'ac-inverter', extras: ['turbo', 'swing', 'sleep'] },
  ],
  'Orient:fan': [
    { key: 'bldc', name: 'Orient BLDC', hint: '5-speed Off / 1–5 Orient BLDC remote', layout: 'fan-numbered', maxSpeed: 5, extras: ['timer', 'light', 'reverse', 'sleep'] },
    { key: 'electric', name: 'Orient Electric', hint: 'Standard 3-speed Orient ceiling kit', layout: 'fan-numbered', maxSpeed: 3, extras: ['timer'] },
  ],
  'Atomberg:fan': [
    { key: 'app', name: 'Atomberg RF / app', hint: 'Mostly RF — IR rarely works', layout: 'fan-numbered', maxSpeed: 5, extras: ['timer', 'light'] },
  ],
  'Colorbot:fan': [
    { key: 'kit', name: 'Colorbot kit', hint: 'Aftermarket ceiling fan remote', layout: 'fan-numbered', maxSpeed: 3, extras: ['timer', 'light'] },
  ],
  'Havells:fan': [
    { key: 'adonia', name: 'Havells Adonia / BLDC', hint: '5-speed Havells BLDC remote', layout: 'fan-numbered', maxSpeed: 5, extras: ['timer', 'light', 'sleep'] },
  ],
  'Crompton:fan': [
    { key: 'energion', name: 'Crompton Energion', hint: '5-speed Crompton BLDC remote', layout: 'fan-numbered', maxSpeed: 5, extras: ['timer', 'sleep'] },
  ],
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function fill(hint: string, brand: string) {
  return hint.replaceAll('{brand}', brand)
}

function toProfile(type: DeviceType, brand: string, way: Way): IrProfile {
  return {
    id: `${slug(brand)}-${type}-${way.key}`,
    type,
    brand,
    name: way.name,
    hint: fill(way.hint, brand),
    layout: way.layout,
    maxSpeed: way.maxSpeed ?? 5,
    extras: way.extras ?? [],
  }
}

function waysFor(type: DeviceType, brand: string): Way[] {
  const base = TYPE_WAYS[type] ?? GENERIC_WAYS
  const extra = SPECIAL[`${brand}:${type}`] ?? []
  const seen = new Set<string>()
  const out: Way[] = []
  for (const way of [...extra, ...base]) {
    if (seen.has(way.key)) continue
    seen.add(way.key)
    out.push(way)
  }
  return out
}

export function profilesFor(type: DeviceType, brand: string): IrProfile[] {
  return waysFor(type, brand).map((way) => toProfile(type, brand, way))
}

export function learnedProfile(type: DeviceType, brand: string): IrProfile {
  return {
    id: `learned:${type}:${slug(brand)}`,
    type,
    brand,
    name: 'Learned remote',
    hint: 'Captured from your original remote',
    layout: 'learn',
    maxSpeed: 3,
    extras: ['timer', 'light'],
  }
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

export function isNumberedFan(layout: RemoteLayout) {
  return layout === 'fan-numbered' || layout === 'fan-light' || layout === 'learn'
}
