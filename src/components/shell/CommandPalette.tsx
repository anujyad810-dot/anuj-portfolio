import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileCode, FileText, GitCommit, Folder, Terminal as TerminalIcon } from 'lucide-react'
import { usePublicProjects } from '@/lib/queries'

export interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const { data: projects = [] } = usePublicProjects()

  // Base navigation pages
  const staticItems = [
    { label: 'README.md', path: '/', category: 'File', icon: FileText },
    { label: 'about.md', path: '/about', category: 'File', icon: FileText },
    { label: 'projects/_index.tsx', path: '/projects', category: 'Folder', icon: Folder },
    { label: 'stack.json', path: '/stack', category: 'File', icon: FileCode },
    { label: 'git-log', path: '/git-log', category: 'File', icon: GitCommit },
    { label: 'education.md', path: '/education', category: 'File', icon: FileText },
    { label: 'resume.pdf', path: '/resume', category: 'File', icon: FileText },
    { label: 'contact.sh', path: '/contact', category: 'Script', icon: TerminalIcon },
  ]

  // Dynamic projects
  const projectItems = projects.map((p) => ({
    label: `${p.title} (${p.slug}.${p.language || 'tsx'})`,
    path: `/projects/${p.slug}`,
    category: 'Project',
    icon: FileCode,
  }))

  const allItems = [...staticItems, ...projectItems]

  const filteredItems = query
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.path.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        navigate(filteredItems[selectedIndex].path)
        onClose()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-xl rounded-lg border border-border bg-panel shadow-2xl overflow-hidden font-mono text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-2 border-b border-border/80 px-3 py-2.5">
          <Search className="h-4 w-4 text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a file or project name to navigate..."
            className="w-full bg-transparent text-text placeholder:text-muted/60 outline-none text-xs"
          />
          <kbd className="hidden sm:inline-block rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] text-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-1 space-y-0.5">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted">
              No matching files or commands found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex

              return (
                <div
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    onClose()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between rounded px-3 py-2 text-xs cursor-pointer transition-colors ${
                    isSelected ? 'bg-accent/15 text-accent' : 'text-text hover:bg-border/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Icon className="h-4 w-4 shrink-0 text-muted" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-muted/70 uppercase tracking-wider font-semibold">
                    {item.category}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
