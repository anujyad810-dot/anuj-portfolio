import { cn } from '@/lib/utils'
import React, { ButtonHTMLAttributes, forwardRef } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-accent text-white hover:bg-accent/90 font-semibold shadow-xs hover:shadow-[0_0_20px_-3px_var(--color-accent)]',
      secondary: 'bg-panel/80 backdrop-blur-xs text-text border border-border hover:border-accent/40 hover:bg-panel',
      danger: 'bg-red-600/90 text-white hover:bg-red-600 shadow-xs',
      ghost: 'text-muted hover:text-text hover:bg-panel/80',
      outline: 'border border-border/80 text-text hover:border-accent/50 hover:bg-panel/60',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span className="inline-block animate-spin mr-1">⟳</span>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
