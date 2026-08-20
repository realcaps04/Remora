import { Minus, Plus } from 'lucide-react'

export function VolumeRocker({
  onUp,
  onDown,
  upLabel = 'Volume up',
  downLabel = 'Volume down',
}: {
  onUp: () => void
  onDown: () => void
  upLabel?: string
  downLabel?: string
}) {
  return (
    <div className="rocker mat-static" role="group" aria-label="Volume">
      <button type="button" className="focus-ring" aria-label={upLabel} onClick={onUp}>
        <Plus size={22} strokeWidth={1.7} />
      </button>
      <button type="button" className="focus-ring" aria-label={downLabel} onClick={onDown}>
        <Minus size={22} strokeWidth={1.7} />
      </button>
    </div>
  )
}
