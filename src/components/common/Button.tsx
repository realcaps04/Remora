import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'quiet'
  children: ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: Props) {
  return (
    <button
      type="button"
      className={cn(
        'focus-ring min-h-12 w-full rounded-full px-5 text-[15px] font-medium tracking-tight transition-transform duration-75 active:scale-[0.98]',
        variant === 'primary' && 'bg-white text-black',
        variant === 'ghost' && 'mat text-white',
        variant === 'quiet' && 'bg-transparent text-[#8e8e93]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
