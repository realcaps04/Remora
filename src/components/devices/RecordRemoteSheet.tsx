import { useEffect, useRef, useState } from 'react'
import { Button } from '../common/Button'
import { BottomSheet } from '../layout/Primitives'
import { categoryLabel } from '../../data/catalog'
import { learnKeysFor } from '../../data/learnKeys'
import { captureIr } from '../../services/irLearner'
import { attachIrPreview, IrCaptureError, startIrCamera, stopIrCamera } from '../../services/irCamera'
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
  const [status, setStatus] = useState<'idle' | 'arming' | 'listening' | 'captured' | 'failed'>('idle')
  const [error, setError] = useState('')
  const [cameraOn, setCameraOn] = useState(false)
  const previewRef = useRef<HTMLVideoElement>(null)
  const listenId = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort()
      stopIrCamera()
      setCameraOn(false)
      return
    }
    setIndex(0)
    setLibrary(initial ?? {})
    setStatus('idle')
    setError('')
    listenId.current += 1
  }, [open, initial, type, brand])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      stopIrCamera()
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
    abortRef.current?.abort()
    const abort = new AbortController()
    abortRef.current = abort
    setError('')
    setStatus('arming')
    try {
      await startIrCamera()
      if (listenId.current !== id) return
      attachIrPreview(previewRef.current)
      setCameraOn(true)
      setStatus('listening')
      const signal = await captureIr(key.id, abort.signal)
      if (listenId.current !== id) return
      setLibrary((prev) => ({ ...prev, [key.id]: signal }))
      setStatus('captured')
    } catch (err) {
      if (listenId.current !== id) return
      const message =
        err instanceof IrCaptureError
          ? err.message
          : err instanceof DOMException && err.name === 'NotAllowedError'
            ? 'Camera permission is required to see the infrared LED.'
            : err instanceof Error
              ? err.message
              : 'Could not record infrared.'
      setError(message)
      setStatus('failed')
    }
  }

  const goNext = () => {
    listenId.current += 1
    abortRef.current?.abort()
    if (index < keys.length - 1) {
      setIndex((i) => i + 1)
      setStatus('idle')
      setError('')
      return
    }
    if (canSave) {
      stopIrCamera()
      onSave(library)
    }
  }

  const close = () => {
    listenId.current += 1
    abortRef.current?.abort()
    stopIrCamera()
    onClose()
  }

  return (
    <BottomSheet open={open} title="Record from original remote" onClose={close}>
      <p className="text-[13px] leading-relaxed text-[#8e8e93]">
        Point the {brand} {categoryLabel(type).toLowerCase()} remote LED at the camera, 3–8 cm away. Remora watches for a
        real flash and will not save a dummy code.
        {type === 'fan' || type === 'cooler'
          ? ' Many BLDC fans use radio (RF), not IR — the camera can see the LED blink, but the phone cannot replay that radio command to the fan.'
          : ''}
      </p>
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-black">
        <video
          ref={previewRef}
          className="h-40 w-full object-cover"
          muted
          playsInline
          autoPlay
        />
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="h-16 w-16 rounded-full border border-white/50" />
        </div>
        {!cameraOn ? (
          <div className="absolute inset-0 grid place-items-center bg-black/55 text-center text-[12px] text-[#d2d2d7]">
            Camera turns on when you record
          </div>
        ) : null}
      </div>
      <div className="mt-4 rounded-2xl bg-[#1c1c1e] px-4 py-4 text-center">
        <p className="text-[12px] tracking-wide text-[#8e8e93]">
          Button {index + 1} of {keys.length}
          {key.required ? ' · Required' : ' · Optional'}
        </p>
        <p className="mt-2 text-[22px] font-medium tracking-tight">{key.label}</p>
        <p className="mt-2 text-[13px] text-[#8e8e93]">
          {status === 'arming'
            ? 'Opening camera…'
            : status === 'listening'
              ? `Press ${key.label} on the original remote now. Keep the LED inside the circle.`
              : status === 'captured'
                ? `${key.label} infrared burst captured.`
                : status === 'failed'
                  ? error || 'No infrared flash seen. Try again.'
                  : `Tap Record, then press ${key.label} once.`}
        </p>
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
        <Button disabled={status === 'listening' || status === 'arming'} onClick={() => void listen()}>
          {status === 'arming'
            ? 'Opening camera…'
            : status === 'listening'
              ? 'Waiting for IR flash…'
              : captured
                ? `Re-record ${key.label}`
                : `Record ${key.label}`}
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
          <Button
            variant="quiet"
            onClick={() => {
              stopIrCamera()
              onSave(library)
            }}
          >
            Save and finish
          </Button>
        ) : null}
      </div>
    </BottomSheet>
  )
}
