import React from 'react'
import { cn } from '@/lib/utils'

export function Spinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  return (
    <div
      className={cn(
        'rounded-full border-border border-t-accent animate-spin inline-block',
        sizes[size],
        className
      )}
      role="status"
      aria-label="loading"
    />
  )
}
