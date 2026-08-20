import type { CommandPayload, DeviceState, IrLibrary, IrSignal } from '../types'
import { startIrCamera, waitForIrBurst } from './irCamera'

const CARRIER = 38000

function hash32(value: string) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function envelopeToPulses(burst: number[], baseline: number) {
  const threshold = baseline + Math.max(12, baseline * 0.15)
  const pulses: number[] = []
  let high = burst[0] >= threshold
  let run = 1
  for (let i = 1; i < burst.length; i += 1) {
    const nextHigh = burst[i] >= threshold
    if (nextHigh === high) {
      run += 1
      continue
    }
    pulses.push(Math.max(200, run * 16000))
    high = nextHigh
    run = 1
  }
  pulses.push(Math.max(200, run * 16000))
  return pulses
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function libraryKeyFor(command: string, payload?: CommandPayload) {
  if (command === 'setSpeed' && typeof payload?.value === 'number') {
    return payload.value <= 0 ? 'off' : `speed${payload.value}`
  }
  if (command === 'powerOn') return 'on'
  if (command === 'powerOff') return 'off'
  return command
}

export async function captureIr(key: string, abort?: AbortSignal): Promise<IrSignal> {
  await startIrCamera()
  const result = await waitForIrBurst(8000, abort)
  const fingerprint = result.burst.map((v) => Math.round(v)).join(',')
  return {
    protocol: 'camera',
    frequency: CARRIER,
    address: hash32(key) & 0xffff,
    command: hash32(`${key}:${fingerprint}`) & 0xff,
    raw: envelopeToPulses(result.burst, result.baseline),
    samples: result.burst.map((v) => Math.round(v)),
    key,
    capturedAt: Date.now(),
  }
}

export type TransmitResult = { sent: boolean; reason?: string }

type IrBridge = {
  hasEmitter?: () => boolean
  transmit: (frequency: number, pattern: number[]) => void | Promise<void>
}

function nativeIr(): IrBridge | undefined {
  const bridge = (window as Window & { RemoraIr?: IrBridge }).RemoraIr
  if (!bridge?.transmit) return undefined
  if (bridge.hasEmitter && !bridge.hasEmitter()) return undefined
  return bridge
}

export function canEmitIr() {
  return Boolean(nativeIr())
}

export async function transmitIr(signal: IrSignal): Promise<TransmitResult> {
  const bridge = nativeIr()
  if (bridge) {
    await bridge.transmit(signal.frequency, signal.raw)
    return { sent: true }
  }
  await wait(Math.min(180, 40 + signal.raw.length))
  return {
    sent: false,
    reason:
      'This browser cannot send infrared or radio. Recording saw the remote LED; it cannot replay that signal to the fan.',
  }
}

export function lookupSignal(
  library: IrLibrary | undefined,
  command: string,
  payload?: CommandPayload,
  state?: Pick<DeviceState, 'power' | 'speed'>,
) {
  if (!library) return undefined
  const key = libraryKeyFor(command, payload)
  if (library[key]) return library[key]
  if (command === 'power') {
    if (state?.power) return library.off ?? library.power
    return library.on ?? library.power ?? library.off
  }
  if (command === 'setSpeed' && payload?.value === 0) return library.off
  if (command === 'speedUp') {
    const next = Math.min(5, Math.max(1, (state?.speed ?? 0) + 1))
    return library[`speed${next}`] ?? library.on
  }
  if (command === 'speedDown') {
    const current = state?.speed ?? 0
    if (current <= 1) return library.off
    return library[`speed${current - 1}`]
  }
  return undefined
}

export function recordedCount(library?: IrLibrary) {
  return library ? Object.keys(library).length : 0
}
