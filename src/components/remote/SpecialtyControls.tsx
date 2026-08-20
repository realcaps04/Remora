import type { ReactNode } from 'react'

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
