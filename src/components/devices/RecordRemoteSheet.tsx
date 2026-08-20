import { useEffect, useRef, useState } from 'react'
import { Button } from '../common/Button'
import { BottomSheet } from '../layout/Primitives'
import { categoryLabel } from '../../data/catalog'
import { learnKeysFor } from '../../data/learnKeys'
import { captureIr } from '../../services/irLearner'
import type { DeviceType, IrLibrary } from '../../types'

export function RecordRemoteSheet({
  open,
  type,
  brand,
  initial,
  onClose,
  onSave,
}: {
  open: boolean
  type: DeviceType
  brand: string
  initial?: IrLibrary
  onClose: () => void
  onSave: (library: IrLibrary) => void
}) {
  const keys = learnKeysFor(type)
  const [index, setIndex] = useState(0)
  const [library, setLibrary] = useState<IrLibrary>({})
  const [status, setStatus] = useState<'idle' | 'listening' | 'captured' | 'failed'>('idle')
  const listenId = useRef(0)

  useEffect(() => {
    if (!open) return
    setIndex(0)
    setLibrary(initial ?? {})
    setStatus('idle')
    listenId.current += 1
  }, [open, initial, type, brand])

  useEffect(() => {
    return () => {
      listenId.current += 1
    }
  }, [])

  if (!open) return null

  const key = keys[index]
  if (!key) return null

  const captured = Boolean(library[key.id])
  const requiredLeft = keys.filter((item) => item.required && !library[item.id]).length
  const canSave = requiredLeft === 0
  const done = index >= keys.length - 1 && (captured || !key.required)

  const listen = async () => {
    const id = listenId.current + 1
    listenId.current = id
    setStatus('listening')
    try {
      const signal = await captureIr(key.id)
      if (listenId.current !== id) return
      setLibrary((prev) => ({ ...prev, [key.id]: signal }))
      setStatus('captured')
    } catch {
      if (listenId.current !== id) return
      setStatus('failed')
    }
  }

  const goNext = () => {
    if (index < keys.length - 1) {
      setIndex((i) => i + 1)
      setStatus('idle')
      return
    }
    if (canSave) onSave(library)
  }

  return (
    <BottomSheet open={open} title="Record from original remote" onClose={onClose}>
      <p className="text-[13px] leading-relaxed text-[#8e8e93]">
        Hold the original {brand} {categoryLabel(type).toLowerCase()} remote a few centimeters from the phone. Remora
        captures each infrared button and saves it to this device.
      </p>
      <div className="mt-4 rounded-2xl bg-[#1c1c1e] px-4 py-4 text-center">
        <p className="text-[12px] tracking-wide text-[#8e8e93]">
          Button {index + 1} of {keys.length}
          {key.required ? ' · Required' : ' · Optional'}
        </p>
        <p className="mt-2 text-[22px] font-medium tracking-tight">{key.label}</p>
        <p className="mt-2 text-[13px] text-[#8e8e93]">
          {status === 'listening'
            ? `Press ${key.label} on the original remote now.`
            : status === 'captured'
              ? `${key.label} saved.`
              : status === 'failed'
                ? 'No signal. Keep the remote close and try again.'
                : `Tap Record, then press ${key.label} on the original remote.`}
        </p>
        <div className="mx-auto mt-5 h-2.5 w-2.5 rounded-full bg-white/20">
          <span
            className={
              status === 'listening'
                ? 'block h-2.5 w-2.5 animate-pulse rounded-full bg-white'
                : status === 'captured'
                  ? 'block h-2.5 w-2.5 rounded-full bg-white'
                  : 'block h-2.5 w-2.5 rounded-full bg-white/25'
            }
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {keys.map((item, i) => (
          <span
            key={item.id}
            className={`rounded-full px-2 py-1 text-[11px] ${
              library[item.id]
                ? 'bg-white/16 text-white'
                : i === index
                  ? 'bg-white/10 text-white'
                  : 'bg-white/5 text-[#8e8e93]'
            }`}
          >
            {item.label}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-2 pb-2">
        <Button disabled={status === 'listening'} onClick={() => void listen()}>
          {status === 'listening' ? 'Listening for IR…' : captured ? `Re-record ${key.label}` : `Record ${key.label}`}
        </Button>
        {captured || !key.required ? (
          <Button variant="ghost" onClick={goNext}>
            {done ? 'Save recorded remote' : 'Next button'}
          </Button>
        ) : null}
        {!key.required && !captured ? (
          <Button variant="quiet" onClick={goNext}>
            Skip {key.label}
          </Button>
        ) : null}
        {canSave && !done ? (
          <Button variant="quiet" onClick={() => onSave(library)}>
            Save and finish
          </Button>
        ) : null}
      </div>
    </BottomSheet>
  )
}
