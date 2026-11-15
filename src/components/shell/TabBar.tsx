import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { X, FileCode, FileText, GitCommit, Terminal as TerminalIcon } from 'lucide-react'
import type { Tab } from '@/hooks/useTabs'

interface TabBarProps {
  tabs: Tab[]
  activeTab: string
  onCloseTab: (id: string) => void
}

export function TabBar({ tabs, activeTab, onCloseTab }: TabBarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const getTabIcon = (label: string) => {
    if (label.endsWith('.md')) return <FileText className="h-3 w-3 text-green shrink-0" />
    if (label.endsWith('.json')) return <span className="text-[10px] font-bold text-orange shrink-0">{'{}'}</span>
    if (label.endsWith('.sh')) return <TerminalIcon className="h-3 w-3 text-yellow-400 shrink-0" />
    if (label === 'git-log') return <GitCommit className="h-3 w-3 text-purple shrink-0" />
    return <FileCode className="h-3 w-3 text-accent shrink-0" />
  }

  const handleClose = (e: React.MouseEvent, tab: Tab) => {
    e.preventDefault()
    e.stopPropagation()
    onCloseTab(tab.id)

    // If closing active tab, navigate to the next or previous
    if (tab.path === location.pathname) {
      const remaining = tabs.filter((t) => t.id !== tab.id)
      if (remaining.length > 0) {
        navigate(remaining[remaining.length - 1].path)
      } else {
        navigate('/')
      }
    }
  }

  return (
    <div className="h-9 bg-panel/60 border-b border-border flex items-center overflow-x-auto select-none no-scrollbar z-10 shrink-0">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path

        return (
          <Link
            key={tab.id}
            to={tab.path}
            className={`group relative h-full flex items-center gap-2 px-3 border-r border-border text-xs font-mono transition-colors min-w-[120px] max-w-[200px] ${
              isActive
                ? 'bg-bg text-text border-t-2 border-t-accent font-medium'
                : 'bg-panel/40 text-muted hover:bg-panel hover:text-text'
            }`}
          >
            {getTabIcon(tab.label)}
            <span className="truncate flex-1">{tab.label}</span>
            <button
              type="button"
              onClick={(e) => handleClose(e, tab)}
              className="rounded p-0.5 text-muted/60 opacity-0 group-hover:opacity-100 hover:bg-border/60 hover:text-text transition-opacity"
              title="Close tab"
            >
              <X className="h-3 w-3" />
            </button>
          </Link>
        )
      })}
    </div>
  )
}
