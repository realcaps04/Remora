import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { cn } from '../../lib/cn'

export function Header({
  title,
  subtitle,
  onBack,
  trailing,
  large,
}: {
  title?: string
  subtitle?: string
  onBack?: () => void
  trailing?: ReactNode
  large?: boolean
}) {
  return (
    <header className="sticky top-0 z-20 bg-black/80 px-5 pb-3 pt-[max(14px,env(safe-area-inset-top))] backdrop-blur-md">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="remote-btn mat focus-ring !h-11 !w-11"
          >
            <ChevronLeft size={20} strokeWidth={1.7} />
          </button>
        ) : (
          <div className="w-11" />
        )}
        <div className="min-w-0 flex-1 text-center">
          {title ? (
            <h1 className={cn('truncate font-medium tracking-tight', large ? 'text-[22px]' : 'text-[16px]')}>
              {title}
            </h1>
          ) : null}
          {subtitle ? <p className="truncate text-[12px] text-[#8e8e93]">{subtitle}</p> : null}
        </div>
        <div className="flex w-11 justify-end">{trailing}</div>
      </div>
    </header>
  )
}
