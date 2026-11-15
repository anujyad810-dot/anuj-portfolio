import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  ChevronRight,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  GitCommit,
  Terminal as TerminalIcon,
  BookOpen,
} from 'lucide-react'
import { usePublicProjects } from '@/lib/queries'

export interface ExplorerProps {
  isOpen: boolean
  onCloseMobile?: () => void
}

export function Explorer({ isOpen, onCloseMobile }: ExplorerProps) {
  const location = useLocation()
  const [rootOpen, setRootOpen] = useState(true)
  const [projectsOpen, setProjectsOpen] = useState(true)

  const { data: projects = [] } = usePublicProjects()

  if (!isOpen) return null

  const getFileBadgeColor = (filename: string) => {
    if (filename.endsWith('.md')) return 'text-green'
    if (filename.endsWith('.json')) return 'text-orange'
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return 'text-accent'
    if (filename.endsWith('.py')) return 'text-purple'
    if (filename.endsWith('.sh')) return 'text-yellow-400'
    if (filename.endsWith('.pdf')) return 'text-red-400'
    return 'text-muted'
  }

  const renderFileIcon = (filename: string) => {
    const color = getFileBadgeColor(filename)
    if (filename === 'git-log') return <GitCommit className="h-3.5 w-3.5 text-purple shrink-0" />
    if (filename.endsWith('.sh')) return <TerminalIcon className={`h-3.5 w-3.5 ${color} shrink-0`} />
    if (filename.endsWith('.json')) return <span className={`text-[10px] font-bold ${color} shrink-0 font-mono`}>{'{}'}</span>
    if (filename.endsWith('.md')) return <FileText className={`h-3.5 w-3.5 ${color} shrink-0`} />
    return <FileCode className={`h-3.5 w-3.5 ${color} shrink-0`} />
  }

  const navItems = [
    { label: 'README.md', path: '/' },
    { label: 'about.md', path: '/about' },
  ]

  const bottomItems = [
    { label: 'stack.json', path: '/stack' },
    { label: 'git-log', path: '/git-log' },
    { label: 'education.md', path: '/education' },
    { label: 'resume.pdf', path: '/resume' },
    { label: 'contact.sh', path: '/contact' },
  ]

  return (
    <aside className="w-60 h-full bg-panel border-r border-border flex flex-col font-mono text-xs select-none z-20 shrink-0">
      <div className="px-3 py-2 text-[11px] font-semibold text-muted uppercase tracking-wider flex items-center justify-between border-b border-border/40">
        <span>Explorer</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {/* Root Directory */}
        <div>
          <button
            type="button"
            onClick={() => setRootOpen(!rootOpen)}
            className="w-full flex items-center gap-1 px-2 py-1 text-text hover:bg-border/30 transition-colors font-semibold"
          >
            {rootOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted" /> : <ChevronRight className="h-3.5 w-3.5 text-muted" />}
            <span>ANUJ-PORTFOLIO</span>
          </button>

          {rootOpen && (
            <div className="pl-3">
              {/* Top files */}
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                      isActive ? 'bg-border/60 text-accent font-semibold' : 'text-text hover:bg-border/30'
                    }`}
                  >
                    {renderFileIcon(item.label)}
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}

              {/* Projects folder */}
              <div>
                <button
                  type="button"
                  onClick={() => setProjectsOpen(!projectsOpen)}
                  className="w-full flex items-center gap-1.5 px-2 py-1 text-text hover:bg-border/30 transition-colors"
                >
                  {projectsOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted" />
                  )}
                  {projectsOpen ? (
                    <FolderOpen className="h-3.5 w-3.5 text-accent/80" />
                  ) : (
                    <Folder className="h-3.5 w-3.5 text-accent/80" />
                  )}
                  <span>projects/</span>
                  <span className="text-[10px] text-muted ml-auto font-normal">({projects.length})</span>
                </button>

                {projectsOpen && (
                  <div className="pl-4 space-y-0.5">
                    {/* All projects index */}
                    <Link
                      to="/projects"
                      onClick={onCloseMobile}
                      className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                        location.pathname === '/projects'
                          ? 'bg-border/60 text-accent font-semibold'
                          : 'text-text hover:bg-border/30'
                      }`}
                    >
                      <BookOpen className="h-3 w-3 text-accent" />
                      <span className="truncate text-muted">_index.tsx</span>
                    </Link>

                    {/* Dynamic project files */}
                    {projects.map((proj) => {
                      const ext = proj.language ? `.${proj.language}` : '.tsx'
                      const filename = `${proj.slug}${ext}`
                      const path = `/projects/${proj.slug}`
                      const isActive = location.pathname === path

                      return (
                        <Link
                          key={proj.id}
                          to={path}
                          onClick={onCloseMobile}
                          className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                            isActive ? 'bg-border/60 text-accent font-semibold' : 'text-text hover:bg-border/30'
                          }`}
                        >
                          {renderFileIcon(filename)}
                          <span className="truncate">{filename}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Bottom files */}
              {bottomItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                      isActive ? 'bg-border/60 text-accent font-semibold' : 'text-text hover:bg-border/30'
                    }`}
                  >
                    {renderFileIcon(item.label)}
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
