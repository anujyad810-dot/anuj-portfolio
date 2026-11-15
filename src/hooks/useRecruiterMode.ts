import { useState, useCallback } from 'react'

const STORAGE_KEY = 'recruiter-mode'

export function useRecruiterMode() {
  const [recruiterMode, setRecruiterMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const toggle = useCallback(() => {
    setRecruiterMode(prev => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const setMode = useCallback((value: boolean) => {
    setRecruiterMode(value)
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // ignore
    }
  }, [])

  return { recruiterMode, toggle, setMode }
}
