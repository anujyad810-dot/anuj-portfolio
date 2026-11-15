import { useState, useCallback } from 'react'

export interface Tab {
  id: string
  label: string
  path: string
  icon?: string
}

const DEFAULT_TABS: Tab[] = [
  { id: 'readme', label: 'README.md', path: '/', icon: 'file-text' },
]

export function useTabs(initialTabs: Tab[] = DEFAULT_TABS) {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs)
  const [activeTab, setActiveTabState] = useState<string>(initialTabs[0]?.id || 'readme')

  const openTab = useCallback((tab: Tab) => {
    setTabs((prev) => {
      if (prev.find((t) => t.id === tab.id)) return prev
      return [...prev, tab]
    })
    setActiveTabState(tab.id)
  }, [])

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== id)
      return filtered.length > 0 ? filtered : DEFAULT_TABS
    })
    setActiveTabState((prev) => {
      if (prev !== id) return prev
      return DEFAULT_TABS[0].id
    })
  }, [])

  const setActiveTab = useCallback((id: string) => {
    setActiveTabState(id)
  }, [])

  return { tabs, activeTab, openTab, closeTab, setActiveTab }
}
