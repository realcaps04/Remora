import type { CommandPayload, IrLibrary, IrSignal } from '../types'
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

export async function transmitIr(signal: IrSignal) {
  await wait(Math.min(180, 40 + signal.raw.length))
  return true
}

export function lookupSignal(library: IrLibrary | undefined, command: string, payload?: CommandPayload) {
  if (!library) return undefined
  const key = libraryKeyFor(command, payload)
  if (library[key]) return library[key]
  if (command === 'power') return library.power ?? library.on ?? library.off
  if (command === 'setSpeed' && payload?.value === 0) return library.off
  return undefined
}

export function recordedCount(library?: IrLibrary) {
  return library ? Object.keys(library).length : 0
}
