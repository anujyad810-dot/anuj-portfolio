import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Trash2 } from 'lucide-react'
import { usePublicProjects, useSkillsWithGroups, useSettings } from '@/lib/queries'

export interface TerminalProps {
  isOpen: boolean
  onClose: () => void
  onToggleTheme: () => void
  currentTheme: 'dark' | 'light'
}

interface HistoryItem {
  id: string
  command: string
  output?: React.ReactNode
}

export function Terminal({ isOpen, onClose, onToggleTheme, currentTheme }: TerminalProps) {
  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'welcome',
      command: '',
      output: (
        <div className="space-y-1 text-muted text-xs">
          <p className="text-accent font-semibold">Anuj Yadav [Version 1.0.0] Interactive Terminal</p>
          <p>Type <span className="text-green font-bold">help</span> to view available commands or explore projects.</p>
        </div>
      ),
    },
  ])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [isMaximized, setIsMaximized] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { data: projects = [] } = usePublicProjects()
  const { data: skillsData } = useSkillsWithGroups()
  const { data: settings } = useSettings()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isOpen, history])

  if (!isOpen) return null

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim()
    if (!trimmed) return

    setCommandHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)

    const parts = trimmed.split(' ')
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    let output: React.ReactNode = null

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-text font-semibold">Available commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted">
              <div><span className="text-accent">about</span> - Read bio and background</div>
              <div><span className="text-accent">projects</span> - List all published projects</div>
              <div><span className="text-accent">open &lt;slug&gt;</span> - Open project details tab</div>
              <div><span className="text-accent">skills</span> - View tech stack overview</div>
              <div><span className="text-accent">resume</span> - Preview or download resume</div>
              <div><span className="text-accent">contact</span> - Open contact terminal form</div>
              <div><span className="text-accent">whoami</span> - Display current user info</div>
              <div><span className="text-accent">theme [dark|light]</span> - Toggle color theme</div>
              <div><span className="text-accent">clear</span> - Clear terminal window</div>
              <div><span className="text-purple">sudo hire anuj</span> - Fast track to hire me!</div>
            </div>
          </div>
        )
        break

      case 'about':
        output = (
          <div className="space-y-1 text-xs text-text">
            <p className="font-semibold text-accent">{settings?.name || 'Anuj Yadav'}</p>
            <p className="text-muted">{settings?.pitch || 'Building fast, intelligent web applications.'}</p>
            <p className="text-muted">Education: B.Tech Computer Science & Design, MITS Gwalior</p>
            <p className="text-xs text-green mt-1">
              Navigating to /about...
            </p>
          </div>
        )
        navigate('/about')
        break

      case 'projects':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-accent font-semibold">Published Projects ({projects.length}):</p>
            <div className="space-y-1 mt-1">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="text-green font-mono">{p.slug}.{p.language || 'tsx'}</span>
                  <span className="text-muted">- {p.title}:</span>
                  <span className="text-text truncate">{p.short_description}</span>
                  <button
                    onClick={() => navigate(`/projects/${p.slug}`)}
                    className="text-accent hover:underline text-[11px] ml-1"
                  >
                    [open]
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
        break

      case 'open':
        if (args.length === 0) {
          output = <p className="text-red-400 text-xs">Usage: open &lt;project-slug&gt;. Type 'projects' to see list.</p>
        } else {
          const targetSlug = args[0].toLowerCase()
          const found = projects.find((p) => p.slug.toLowerCase() === targetSlug)
          if (found) {
            output = <p className="text-green text-xs">Opening project '{found.title}'...</p>
            navigate(`/projects/${found.slug}`)
          } else {
            output = (
              <p className="text-red-400 text-xs">
                Project '{targetSlug}' not found. Try 'projects' to list all.
              </p>
            )
          }
        }
        break

      case 'skills':
        output = (
          <div className="space-y-1.5 text-xs">
            <p className="text-accent font-semibold">Technology Stack Overview:</p>
            {skillsData?.groups?.map((group) => {
              const groupSkills = skillsData.skills.filter((s) => s.group_id === group.id)
              return (
                <div key={group.id} className="text-muted">
                  <span className="text-purple font-semibold">{group.name}: </span>
                  <span>{groupSkills.map((s) => s.name).join(', ')}</span>
                </div>
              )
            })}
          </div>
        )
        break

      case 'resume':
        output = <p className="text-green text-xs">Navigating to Resume page...</p>
        navigate('/resume')
        break

      case 'contact':
        output = <p className="text-green text-xs">Opening contact prompt...</p>
        navigate('/contact')
        break

      case 'whoami':
        output = (
          <div className="text-xs space-y-0.5 text-muted">
            <p>user: <span className="text-text">visitor</span></p>
            <p>permissions: <span className="text-green">read-only [portfolio-explorer]</span></p>
            <p>host: <span className="text-accent">anuj-yadav-portfolio</span></p>
          </div>
        )
        break

      case 'theme':
        if (args[0] === 'dark' || args[0] === 'light') {
          if (args[0] !== currentTheme) {
            onToggleTheme()
          }
          output = <p className="text-green text-xs">Theme switched to {args[0]}.</p>
        } else {
          onToggleTheme()
          output = <p className="text-green text-xs">Theme toggled.</p>
        }
        break

      case 'clear':
        setHistory([])
        setInputVal('')
        return

      case 'sudo':
        if (parts.slice(1).join(' ').toLowerCase() === 'hire anuj') {
          output = (
            <div className="space-y-1 text-xs">
              <p className="text-green font-bold">Access granted! Excellent choice.</p>
              <p className="text-text">Redirecting you directly to Anuj's priority contact channel...</p>
            </div>
          )
          setTimeout(() => navigate('/contact'), 800)
        } else {
          output = <p className="text-red-400 text-xs">Permission denied: try 'sudo hire anuj' instead.</p>
        }
        break

      default:
        output = (
          <p className="text-red-400 text-xs">
            command not found: {trimmed}. Type <span className="text-accent font-semibold">help</span> for a list of commands.
          </p>
        )
        break
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: trimmed,
        output,
      },
    ])
    setInputVal('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(nextIndex)
        setInputVal(commandHistory[nextIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInputVal('')
        } else {
          setHistoryIndex(nextIndex)
          setInputVal(commandHistory[nextIndex])
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Tab autocomplete on project slugs
      if (inputVal.startsWith('open ')) {
        const query = inputVal.replace('open ', '').toLowerCase()
        const match = projects.find((p) => p.slug.toLowerCase().startsWith(query))
        if (match) {
          setInputVal(`open ${match.slug}`)
        }
      }
    }
  }

  return (
    <div
      className={`border-t border-border bg-[#0d1117] flex flex-col font-mono text-xs z-30 transition-all duration-150 ${
        isMaximized ? 'h-[75vh]' : 'h-64'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="h-7 bg-panel px-3 border-b border-border/80 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2 text-muted">
          <TerminalIcon className="h-3.5 w-3.5 text-accent" />
          <span className="font-semibold text-[11px] uppercase tracking-wider text-text">Terminal</span>
          <span className="text-[10px] text-muted">bash</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setHistory([])}
            className="p-1 rounded text-muted hover:text-text transition-colors"
            title="Clear terminal"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded text-muted hover:text-text transition-colors"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-muted hover:text-text transition-colors"
            title="Close terminal"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Stream */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-2 select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2 text-text">
                <span className="text-green font-semibold">visitor@anuj:~$</span>
                <span>{item.command}</span>
              </div>
            )}
            {item.output && <div className="pl-4">{item.output}</div>}
          </div>
        ))}

        {/* Live Input Line */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-green font-semibold shrink-0">visitor@anuj:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-text outline-none caret-accent"
            autoFocus
          />
        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
  )
}
