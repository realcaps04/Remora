import type { CommandPayload, IrLibrary, IrSignal } from '../types'

const CARRIER = 38000

function hash32(value: string) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function encodeNec(address: number, command: number) {
  const bits: number[] = []
  const pushByte = (value: number) => {
    for (let i = 0; i < 8; i += 1) {
      bits.push(560)
      bits.push((value >> i) & 1 ? 1690 : 560)
    }
  }
  const pulses = [9000, 4500]
  pushByte(address & 0xff)
  pushByte((address >> 8) & 0xff)
  pushByte(command & 0xff)
  pushByte(~command & 0xff)
  pulses.push(...bits, 560)
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

export async function captureIr(key: string): Promise<IrSignal> {
  await wait(850 + Math.random() * 350)
  const seed = `${key}:${performance.now()}:${Math.random().toString(36).slice(2)}`
  const address = hash32(key) & 0xffff
  const command = hash32(seed) & 0xff
  return {
    protocol: 'nec',
    frequency: CARRIER,
    address,
    command,
    raw: encodeNec(address, command),
    key,
    capturedAt: Date.now(),
  }
}

export async function transmitIr(signal: IrSignal) {
  await wait(55 + Math.min(40, Math.floor(signal.raw.length / 8)))
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
