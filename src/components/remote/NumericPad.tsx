import { RemoteButton } from './RemoteButton'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '–', '0', '↩'] as const

export function NumericPad({ onDigit }: { onDigit: (n: number) => void }) {
  return (
    <div className="grid grid-cols-3 justify-items-center gap-4 px-6" role="group" aria-label="Number pad">
      {KEYS.map((key) => {
        const n = key === '0' || (key >= '1' && key <= '9') ? Number(key) : null
        return (
          <RemoteButton
            key={key}
            size="sm"
            disabled={n === null}
            aria-label={n === null ? undefined : `Channel ${n}`}
            onClick={() => n !== null && onDigit(n)}
            className={n === null ? 'opacity-0 pointer-events-none' : ''}
          >
            <span className="text-[18px] font-medium tracking-tight">{key}</span>
          </RemoteButton>
        )
      })}
    </div>
  )
}
