import React from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
  showBorder?: boolean
}

export function GradientText({
  children,
  className,
  colors = ['#0284c7', '#4f46e5', '#7c3aed', '#0284c7'],
  animationSpeed = 7,
  showBorder = false,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  }

  return (
    <span
      className={cn(
        'relative inline-block font-bold tracking-tight bg-clip-text text-transparent bg-[length:300%_100%] animate-gradient',
        showBorder && 'border border-border/50 px-2 py-0.5 rounded-md',
        className
      )}
      style={gradientStyle}
    >
      {children}
    </span>
  )
}
