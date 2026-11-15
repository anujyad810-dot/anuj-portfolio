import React from 'react'
import { Files, Search, GitBranch, Terminal as TerminalIcon, Sun, Moon, Lock } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface ActivityBarProps {
  explorerOpen: boolean
  onToggleExplorer: () => void
  onOpenSearch: () => void
  terminalOpen: boolean
  onToggleTerminal: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export function ActivityBar({
  explorerOpen,
  onToggleExplorer,
  onOpenSearch,
  terminalOpen,
  onToggleTerminal,
  theme,
  onToggleTheme,
}: ActivityBarProps) {
  const location = useLocation()
  const isGitLog = location.pathname === '/git-log'

  return (
    <aside className="w-12 h-full bg-panel border-r border-border flex flex-col items-center justify-between py-2 select-none z-30 shrink-0">
      {/* Top icons */}
      <div className="flex flex-col items-center gap-2 w-full">
        <button
          type="button"
          onClick={onToggleExplorer}
          className={`relative w-full h-10 flex items-center justify-center text-muted hover:text-text transition-colors ${
            explorerOpen ? 'text-accent' : ''
          }`}
          title="Toggle Explorer (File Tree)"
          aria-label="Toggle Explorer"
        >
          {explorerOpen && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-r" />
          )}
          <Files className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onOpenSearch}
          className="relative w-full h-10 flex items-center justify-center text-muted hover:text-text transition-colors"
          title="Command Palette (Ctrl+K)"
          aria-label="Search and Command Palette"
        >
          <Search className="h-5 w-5" />
        </button>

        <Link
          to="/git-log"
          className={`relative w-full h-10 flex items-center justify-center text-muted hover:text-text transition-colors ${
            isGitLog ? 'text-accent' : ''
          }`}
          title="Source Control (Git Log & Experience)"
          aria-label="Git Log"
        >
          {isGitLog && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-r" />
          )}
          <GitBranch className="h-5 w-5" />
        </Link>

        <button
          type="button"
          onClick={onToggleTerminal}
          className={`relative w-full h-10 flex items-center justify-center text-muted hover:text-text transition-colors ${
            terminalOpen ? 'text-accent' : ''
          }`}
          title="Toggle Terminal"
          aria-label="Toggle Terminal"
        >
          {terminalOpen && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-r" />
          )}
          <TerminalIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-2 w-full">
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-full h-10 flex items-center justify-center text-muted hover:text-text transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <Link
          to="/admin"
          className="w-full h-10 flex items-center justify-center text-muted hover:text-accent transition-colors"
          title="Admin Portal"
          aria-label="Admin Portal"
        >
          <Lock className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  )
}
