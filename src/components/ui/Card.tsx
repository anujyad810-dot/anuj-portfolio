import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export function Card({ title, subtitle, action, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-lg border border-border bg-panel p-5 text-text', className)}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between border-b border-border/60 pb-3 mb-4">
          <div>
            {title && <h3 className="font-mono text-sm font-semibold text-text">{title}</h3>}
            {subtitle && <p className="font-mono text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
