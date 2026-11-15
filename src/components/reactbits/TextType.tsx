import React, { useState, useEffect } from 'react'

interface TextTypeProps {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  className?: string
  cursorClassName?: string
}

export function TextType({
  words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 1800,
  className = '',
  cursorClassName = 'text-accent',
}: TextTypeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!words || words.length === 0) return

    const fullWord = words[currentWordIndex % words.length]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(fullWord.slice(0, currentText.length + 1))
          if (currentText === fullWord) {
            setTimeout(() => setIsDeleting(true), pauseDuration)
          }
        } else {
          setCurrentText(fullWord.slice(0, currentText.length - 1))
          if (currentText === '') {
            setIsDeleting(false)
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{currentText}</span>
      <span className={`inline-block animate-blink ml-0.5 font-mono ${cursorClassName}`}>
        _
      </span>
    </span>
  )
}
