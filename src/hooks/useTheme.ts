import { useEffect } from 'react'

export type Theme = 'light'

export function useTheme() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('light')
    root.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }, [])

  return {
    theme: 'light' as const,
    toggleTheme: () => {},
    toggle: () => {},
    setTheme: () => {},
  }
}
