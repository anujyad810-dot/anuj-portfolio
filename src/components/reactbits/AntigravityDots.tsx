import React, { useEffect, useRef } from 'react'

export interface AntigravityDotsProps {
  spacing?: number
  dotSize?: number
  interactionRadius?: number
  accentColor?: string
  className?: string
}

interface Dot {
  baseX: number
  baseY: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseSize: number
  alpha: number
  baseAlpha: number
  targetAlpha: number
  isHighlighted: boolean
}

export function AntigravityDots({
  spacing = 34,
  dotSize = 1.6,
  interactionRadius = 130,
  accentColor = '#0284c7',
  className = '',
}: AntigravityDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0
    let dots: Dot[] = []

    const mouse = {
      x: -1000,
      y: -1000,
      radius: interactionRadius,
      isDown: false,
    }

    const baseAlpha = 0.12
    const defaultDotColor = '#0f172a'

    const initDots = () => {
      dots = []
      const cols = Math.floor(width / spacing)
      const rows = Math.floor(height / spacing)
      const offsetX = (width - cols * spacing) / 2
      const offsetY = (height - rows * spacing) / 2

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * spacing
          const y = offsetY + j * spacing
          dots.push({
            baseX: x,
            baseY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            size: dotSize,
            baseSize: dotSize,
            alpha: baseAlpha,
            baseAlpha,
            targetAlpha: baseAlpha,
            isHighlighted: false,
          })
        }
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      initDots()
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    const handleMouseDown = () => {
      mouse.isDown = true
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        const dx = d.x - mouse.x
        const dy = d.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < mouse.radius * 1.8 && dist > 0) {
          const force = ((mouse.radius * 1.8 - dist) / (mouse.radius * 1.8)) * 14
          d.vx += (dx / dist) * force
          d.vy += (dy / dist) * force
        }
      }
    }

    const handleMouseUp = () => {
      mouse.isDown = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX
        mouse.y = e.touches[0].clientY
      }
    }

    const handleTouchEnd = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    const friction = 0.82
    const springFactor = 0.05
    const repelStrength = 4.8

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]

        if (!prefersReducedMotion) {
          const dx = mouse.x - dot.x
          const dy = mouse.y - dot.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius
            const angle = Math.atan2(dy, dx)
            dot.vx -= Math.cos(angle) * force * repelStrength
            dot.vy -= Math.sin(angle) * force * repelStrength

            dot.targetAlpha = Math.min(0.9, dot.baseAlpha + force * 0.78)
            dot.size = dot.baseSize + force * 2.2
            dot.isHighlighted = true
          } else {
            dot.targetAlpha = dot.baseAlpha
            dot.size = dot.baseSize
            dot.isHighlighted = false
          }

          const homeDx = dot.baseX - dot.x
          const homeDy = dot.baseY - dot.y
          dot.vx += homeDx * springFactor
          dot.vy += homeDy * springFactor

          dot.vx *= friction
          dot.vy *= friction

          dot.x += dot.vx
          dot.y += dot.vy

          dot.alpha += (dot.targetAlpha - dot.alpha) * 0.15
        }

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, Math.max(0.5, dot.size), 0, Math.PI * 2)

        if (dot.isHighlighted) {
          ctx.fillStyle = accentColor
          ctx.globalAlpha = dot.alpha
        } else {
          ctx.fillStyle = defaultDotColor
          ctx.globalAlpha = dot.alpha
        }

        ctx.fill()
      }

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [spacing, dotSize, interactionRadius, accentColor])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 w-full h-full ${className}`}
      style={{ willChange: 'transform' }}
    />
  )
}
