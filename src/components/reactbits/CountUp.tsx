import React, { useEffect, useState, useRef } from 'react'

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  className?: string
  startWhen?: boolean
  separator?: string
}

export function CountUp({
  to,
  from = 0,
  duration = 1.5,
  className = '',
  startWhen = true,
  separator = '',
}: CountUpProps) {
  const [count, setCount] = useState<number>(from)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!startWhen) return

    let startTime: number | null = null
    let animationFrame: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const currentVal = Math.floor(progress * (to - from) + from)
      setCount(currentVal)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      } else {
        setCount(to)
      }
    }

    animationFrame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrame)
  }, [to, from, duration, startWhen])

  const formatted = separator
    ? count.toLocaleString()
    : count.toString()

  return (
    <span ref={ref} className={className}>
      {formatted}
    </span>
  )
}
