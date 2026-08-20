import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function BottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50">
      <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-[28px] bg-[#111113] px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15" />
        <h2 className="mb-4 text-[18px] font-medium tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 grid place-items-center px-6">
      <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close" onClick={onClose} />
      <div className="relative w-full rounded-3xl bg-[#161618] p-5">
        <h2 className="mb-3 text-[18px] font-medium tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('px-5', className)}>{children}</div>
}

export function SectionHeader({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="text-[15px] font-medium tracking-tight text-[#8e8e93]">{title}</h2>
      {action}
    </div>
  )
}
