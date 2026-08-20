import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function ChannelControl({
  onUp,
  onDown,
}: {
  onUp: () => void
  onDown: () => void
}) {
  return (
    <div className="rocker mat-static" role="group" aria-label="Channel">
      <button type="button" className="focus-ring text-[13px] font-medium tracking-wide" aria-label="Channel up" onClick={onUp}>
        CH+
      </button>
      <button type="button" className="focus-ring text-[13px] font-medium tracking-wide" aria-label="Channel down" onClick={onDown}>
        CH−
      </button>
    </div>
  )
}

export function FanSpeedPad({
  max,
  speed,
  power,
  onPick,
}: {
  max: number
  speed: number
  power: boolean
  onPick: (n: number) => void
}) {
  const cols = max >= 5 ? 'grid-cols-5' : max === 4 ? 'grid-cols-4' : 'grid-cols-3'
  return (
    <div className="w-full max-w-[320px]" role="group" aria-label="Fan speed">
      <div className={cn('grid gap-2', cols)}>
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1
          return (
            <button
              key={n}
              type="button"
              aria-label={`Speed ${n}`}
              aria-pressed={power && speed === n}
              onClick={() => onPick(n)}
              className={cn(
                'remote-btn mat focus-ring !h-14 !w-full !min-w-0 rounded-2xl text-[17px] font-medium',
                power && speed === n && 'armed',
              )}
            >
              {n}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        aria-label="Off"
        aria-pressed={!power}
        onClick={() => onPick(0)}
        className={cn(
          'remote-btn mat focus-ring mt-2.5 !h-12 !w-full !min-w-0 rounded-2xl text-[14px] font-medium',
          !power && 'armed',
        )}
      >
        Off
      </button>
    </div>
  )
}

export function FanSpeedControl({
  onUp,
  onDown,
}: {
  onUp: () => void
  onDown: () => void
}) {
  return (
    <div className="rocker mat-static" role="group" aria-label="Fan speed">
      <button type="button" className="focus-ring text-[13px] font-medium" aria-label="Speed up" onClick={onUp}>
        +
      </button>
      <button type="button" className="focus-ring text-[13px] font-medium" aria-label="Speed down" onClick={onDown}>
        −
      </button>
    </div>
  )
}

export function TemperatureControl({
  onUp,
  onDown,
}: {
  onUp: () => void
  onDown: () => void
}) {
  return (
    <div className="rocker mat-static" role="group" aria-label="Temperature">
      <button type="button" className="focus-ring text-[15px] font-medium" aria-label="Temperature up" onClick={onUp}>
        +
      </button>
      <button type="button" className="focus-ring text-[15px] font-medium" aria-label="Temperature down" onClick={onDown}>
        −
      </button>
    </div>
  )
}

export function Dial({
  label,
  value,
  hint,
}: {
  label: string
  value: ReactNode
  hint?: string
}) {
  return (
    <div className="dial mx-auto" aria-label={label}>
      <div className="dial-face">
        <div>
          <div className="text-[40px] font-medium leading-none tracking-tight text-white">{value}</div>
          {hint ? <div className="mt-2 text-[12px] text-[#8e8e93]">{hint}</div> : null}
        </div>
      </div>
    </div>
  )
}
