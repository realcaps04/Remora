import type { ElementType } from 'react'
import { cn } from '../../lib/cn'

export function Wordmark({
  as: Tag = 'div',
  className,
}: {
  as?: ElementType
  className?: string
}) {
  return (
    <Tag className={cn('wordmark', className)} aria-label="Remora">
      REMORA
    </Tag>
  )
}
