import type { DeviceState } from '../types'

export function defaultDeviceState(): DeviceState {
  return {
    power: false,
    volume: 18,
    muted: false,
    channel: 102,
    source: 'HDMI 1',
    playing: false,
    speed: 2,
    oscillation: false,
    fanMode: 'Normal',
    timerMinutes: 0,
    temperature: 24,
    acMode: 'cool',
    acFan: 'auto',
    swing: true,
    sleep: false,
    turbo: false,
    brightness: 0,
    bass: 0,
    treble: 0,
    input: 'TV',
    bluetooth: false,
  }
}
