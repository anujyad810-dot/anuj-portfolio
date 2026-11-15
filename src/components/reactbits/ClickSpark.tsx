import React, { useRef, useEffect } from 'react'

interface ClickSparkProps {
  children: React.ReactNode
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
}

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

export function ClickSpark({
  children,
  sparkColor = 'var(--color-accent)',
  sparkSize = 8,
  sparkRadius = 24,
  sparkCount = 8,
  duration = 400,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sparksRef = useRef<Spark[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) return false

        const progress = elapsed / duration
        const distance = progress * sparkRadius
        const currentX = spark.x + Math.cos(spark.angle) * distance
        const currentY = spark.y + Math.sin(spark.angle) * distance
        const alpha = 1 - progress

        ctx.fillStyle = sparkColor.startsWith('var') ? '#58a6ff' : sparkColor
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(currentX, currentY, sparkSize * (1 - progress), 0, Math.PI * 2)
        ctx.fill()
        return true
      })

      animationId = requestAnimationFrame(draw)
    }

    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [sparkColor, sparkSize, sparkRadius, duration])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const now = performance.now()

    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x,
        y,
        angle: (Math.PI * 2 * i) / sparkCount,
        startTime: now,
      })
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden" onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-50 w-full h-full"
      />
      {children}
    </div>
  )
}
