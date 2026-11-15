import React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'default' | 'accent' | 'green' | 'purple' | 'orange' | 'outline'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-panel/80 text-text border-border/80',
    accent: 'bg-accent/15 text-accent border-accent/30',
    green: 'bg-green/15 text-green border-green/30',
    purple: 'bg-purple/15 text-purple border-purple/30',
    orange: 'bg-orange/15 text-orange border-orange/30',
    outline: 'bg-transparent text-muted border-border/70',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-mono font-medium border transition-colors backdrop-blur-xs',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
