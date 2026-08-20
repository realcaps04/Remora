import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'md' | 'sm' | 'lg'
  active?: boolean
  children: ReactNode
}

export function RemoteButton({ size = 'md', active, className, children, ...props }: Props) {
  return (
    <button
      type="button"
      className={cn(
        'remote-btn mat focus-ring',
        size === 'sm' && 'sm',
        size === 'lg' && 'lg',
        active && 'armed',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
