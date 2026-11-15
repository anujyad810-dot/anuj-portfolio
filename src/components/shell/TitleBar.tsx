import React from 'react'
import { Briefcase, Code } from 'lucide-react'

interface TitleBarProps {
  recruiterMode: boolean
  onToggleRecruiterMode: () => void
}

export function TitleBar({ recruiterMode, onToggleRecruiterMode }: TitleBarProps) {
  return (
    <header className="h-7 w-full bg-panel border-b border-border flex items-center justify-between px-3 select-none z-40 text-xs font-mono">
      {/* Decorative window control dots */}
      <div className="flex items-center gap-1.5 w-24">
        <div className="h-3 w-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
        <div className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
        <div className="h-3 w-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 text-muted truncate">
        <Code className="h-3.5 w-3.5 text-accent shrink-0" />
        <span className="truncate">anuj-yadav — portfolio [workspace]</span>
      </div>

      {/* Right controls: Recruiter mode toggle */}
      <div className="flex items-center gap-2 w-auto justify-end">
        <button
          type="button"
          onClick={onToggleRecruiterMode}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
            recruiterMode
              ? 'bg-accent text-[#0d1117] font-semibold'
              : 'text-muted hover:text-text hover:bg-border/40'
          }`}
          title={recruiterMode ? 'Switch back to Code Editor View' : 'Switch to Recruiter Quick View'}
        >
          <Briefcase className="h-3 w-3" />
          <span>{recruiterMode ? 'Editor View' : 'Recruiter Mode'}</span>
        </button>
      </div>
    </header>
  )
}
