import React, { useEffect, useState, useRef } from 'react'

interface DecryptedTextProps {
  text: string
  speed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: 'start' | 'end' | 'center'
  useOriginalCharsOnly?: boolean
  characters?: string
  className?: string
  encryptedClassName?: string
  parentClassName?: string
  animateOn?: 'view' | 'hover'
}

export function DecryptedText({
  text,
  speed = 40,
  maxIterations = 10,
  sequential = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+~`|}{[]:;?><,./-=',
  className = '',
  encryptedClassName = 'text-accent opacity-75',
  parentClassName = '',
  animateOn = 'hover',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text)
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [isScrambling, setIsScrambling] = useState<boolean>(false)
  const iterationRef = useRef<number>(0)

  const triggerAnimation = () => {
    setIsScrambling(true)
    iterationRef.current = 0
  }

  useEffect(() => {
    if (animateOn === 'view') {
      triggerAnimation()
    }
  }, [animateOn, text])

  useEffect(() => {
    if (!isScrambling) return

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (sequential) {
              if (index < iterationRef.current) {
                return text[index]
              }
              return characters[Math.floor(Math.random() * characters.length)]
            } else {
              if (iterationRef.current >= maxIterations) {
                return text[index]
              }
              return characters[Math.floor(Math.random() * characters.length)]
            }
          })
          .join('')
      })

      iterationRef.current += 1

      const shouldStop = sequential
        ? iterationRef.current > text.length
        : iterationRef.current > maxIterations

      if (shouldStop) {
        clearInterval(interval)
        setIsScrambling(false)
        setDisplayText(text)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [isScrambling, text, speed, maxIterations, sequential, characters])

  return (
    <span
      className={`inline-block ${parentClassName}`}
      onMouseEnter={() => {
        setIsHovering(true)
        if (animateOn === 'hover') triggerAnimation()
      }}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className={isScrambling ? encryptedClassName : className}>
        {displayText}
      </span>
    </span>
  )
}
