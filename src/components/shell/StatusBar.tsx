import React, { useState, useEffect } from 'react'
import { GitBranch, MapPin, Radio, Clock, Sparkles } from 'lucide-react'
import { useSettings } from '@/lib/queries'

export interface StatusBarProps {
  theme: 'dark' | 'light'
}

export function StatusBar({ theme }: StatusBarProps) {
  const { data: settings } = useSettings()
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000 * 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="h-6 w-full bg-[#161b22] border-t border-border flex items-center justify-between px-3 text-[11px] font-mono text-muted select-none z-30 shrink-0">
      {/* Left items */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-accent font-medium hover:text-accent/80 cursor-pointer">
          <GitBranch className="h-3 w-3" />
          <span>main</span>
        </div>

        {settings?.availability_text && (
          <div className="flex items-center gap-1.5 text-green">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green"></span>
            </span>
            <span className="truncate max-w-[200px]">{settings.availability_text}</span>
          </div>
        )}
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3">
        {settings?.location && (
          <div className="hidden sm:flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted" />
            <span>{settings.location}</span>
          </div>
        )}

        <div className="flex items-center gap-1 uppercase">
          <Sparkles className="h-3 w-3 text-purple" />
          <span>UTF-8</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{time}</span>
        </div>
      </div>
    </footer>
  )
}
