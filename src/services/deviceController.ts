import type { CommandPayload, CommandResult, Device, DeviceState } from '../types'

/**
 * Simulated device controller.
 * Later this is the only UI-facing entry for hardware:
 *   Remora UI → Device Controller → Connection Manager → IR / BT / Wi-Fi / Smart Home
 */
export async function sendCommand(
  device: Device,
  command: string,
  payload?: CommandPayload,
): Promise<CommandResult> {
  if (device.status === 'offline' || device.status === 'disconnected') {
    return { ok: false, message: 'Device is not reachable' }
  }
  applyCommand(device.state, command, payload)
  await wait(90 + Math.random() * 80)
  return { ok: true }
}

export function applyCommand(
  state: DeviceState,
  command: string,
  payload?: CommandPayload,
) {
  switch (command) {
    case 'power':
      state.power = !state.power
      break
    case 'powerOn':
      state.power = true
      if (state.speed < 1) state.speed = 1
      break
    case 'powerOff':
      state.power = false
      break
    case 'volumeUp':
      state.muted = false
      state.volume = clamp(state.volume + 1, 0, 50)
      break
    case 'volumeDown':
      state.volume = clamp(state.volume - 1, 0, 50)
      break
    case 'mute':
      state.muted = !state.muted
      break
    case 'channelUp':
      state.channel = clamp(state.channel + 1, 1, 999)
      break
    case 'channelDown':
      state.channel = clamp(state.channel - 1, 1, 999)
      break
    case 'setChannel':
      if (typeof payload?.value === 'number') state.channel = clamp(payload.value, 1, 999)
      break
    case 'number':
      if (typeof payload?.value === 'number') {
        const next = Number(`${state.channel % 100}${payload.value}`)
        state.channel = clamp(next, 0, 999)
      }
      break
    case 'source':
      state.source = cycle(state.source, ['HDMI 1', 'HDMI 2', 'TV', 'AV'])
      break
    case 'input':
      state.input = cycle(state.input, ['TV', 'HDMI ARC', 'Bluetooth', 'Optical', 'USB'])
      break
    case 'playPause':
      state.playing = !state.playing
      break
    case 'speedUp':
      state.power = true
      state.speed = clamp(state.speed + 1, 1, 5)
      break
    case 'speedDown':
      state.speed = clamp(state.speed - 1, 1, 5)
      break
    case 'setSpeed':
      if (typeof payload?.value === 'number') {
        state.speed = clamp(payload.value, 0, 5)
        state.power = state.speed > 0
      }
      break
    case 'fanLight':
      state.brightness = state.brightness > 0 ? 0 : 100
      break
    case 'reverse':
      state.oscillation = !state.oscillation
      break
    case 'oscillation':
      state.oscillation = !state.oscillation
      break
    case 'fanMode':
      state.fanMode = cycle(state.fanMode, ['Normal', 'Breeze', 'Sleep'])
      break
    case 'timer':
      state.timerMinutes = cycle(state.timerMinutes, [0, 30, 60, 120])
      break
    case 'tempUp':
      state.power = true
      state.temperature = clamp(state.temperature + 1, 16, 30)
      break
    case 'tempDown':
      state.temperature = clamp(state.temperature - 1, 16, 30)
      break
    case 'acMode':
      state.acMode = cycle(state.acMode, ['cool', 'heat', 'fan', 'dry', 'auto'])
      break
    case 'acFan':
      state.acFan = cycle(state.acFan, ['auto', 'low', 'med', 'high'])
      break
    case 'swing':
      state.swing = !state.swing
      break
    case 'sleep':
      state.sleep = !state.sleep
      break
    case 'turbo':
      state.turbo = !state.turbo
      break
    case 'bassUp':
      state.bass = clamp(state.bass + 1, -6, 6)
      break
    case 'bassDown':
      state.bass = clamp(state.bass - 1, -6, 6)
      break
    case 'trebleUp':
      state.treble = clamp(state.treble + 1, -6, 6)
      break
    case 'trebleDown':
      state.treble = clamp(state.treble - 1, -6, 6)
      break
    case 'bluetooth':
      state.bluetooth = !state.bluetooth
      if (state.bluetooth) state.input = 'Bluetooth'
      break
    case 'setBrightness': {
      const next = typeof payload?.value === 'number' ? payload.value : 20
      state.brightness = clamp(next, 0, 100)
      state.power = state.brightness > 0
      break
    }
    case 'brightnessUp':
      state.power = true
      state.brightness = clamp(state.brightness + 10, 0, 100)
      break
    case 'brightnessDown':
      state.brightness = clamp(state.brightness - 10, 0, 100)
      if (state.brightness === 0) state.power = false
      break
    default:
      break
  }
}

export function commandLabel(device: Device, command: string, payload?: CommandPayload) {
  const name = device.name
  switch (command) {
    case 'power':
    case 'powerOn':
    case 'powerOff':
      return `${name} ${device.state.power ? 'powered on' : 'powered off'}`
    case 'volumeUp':
    case 'volumeDown':
      return `${name} → Volume ${device.state.volume}`
    case 'mute':
      return `${name} ${device.state.muted ? 'muted' : 'unmuted'}`
    case 'channelUp':
    case 'channelDown':
    case 'setChannel':
    case 'number':
      return `${name} → Channel ${device.state.channel}`
    case 'speedUp':
    case 'speedDown':
    case 'setSpeed':
      return `${name} → Speed ${device.state.speed || 'Off'}`
    case 'fanLight':
      return `${name} light ${device.state.brightness > 0 ? 'on' : 'off'}`
    case 'reverse':
      return `${name} reverse ${device.state.oscillation ? 'on' : 'off'}`
    case 'oscillation':
      return `${name} oscillation ${device.state.oscillation ? 'on' : 'off'}`
    case 'tempUp':
    case 'tempDown':
      return `${name} → ${device.state.temperature}°C`
    case 'acMode':
      return `${name} → ${capitalize(device.state.acMode)}`
    case 'playPause':
      return `${name} ${device.state.playing ? 'playing' : 'paused'}`
    case 'setBrightness':
    case 'brightnessUp':
    case 'brightnessDown':
      return `${name} → ${device.state.brightness}%`
    case 'up':
      return `${name} · Up`
    case 'down':
      return `${name} · Down`
    case 'left':
      return `${name} · Left`
    case 'right':
      return `${name} · Right`
    case 'ok':
      return `${name} · OK`
    case 'back':
      return `${name} · Back`
    case 'home':
      return `${name} · Home`
    default:
      if (payload?.value !== undefined) return `${name} · ${command} ${payload.value}`
      return `${name} · ${command}`
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function cycle<T>(current: T, values: readonly T[]) {
  const i = values.indexOf(current)
  return values[(i + 1) % values.length] as T
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
