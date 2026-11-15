import React, { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Eye, Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MarkdownEditorProps {
  label?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  error?: string
  placeholder?: string
  className?: string
}

export function MarkdownEditor({
  label,
  value,
  onChange,
  rows = 6,
  error,
  placeholder = 'Write markdown here...',
  className,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  return (
    <div className={cn('w-full space-y-1', className)}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-mono text-muted uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="flex items-center gap-1 rounded border border-border bg-panel p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-0.5 transition-colors',
              mode === 'edit' ? 'bg-bg text-accent font-semibold' : 'text-muted hover:text-text'
            )}
          >
            <Edit3 className="h-3 w-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={cn(
              'flex items-center gap-1 rounded px-2 py-0.5 transition-colors',
              mode === 'preview' ? 'bg-bg text-accent font-semibold' : 'text-muted hover:text-text'
            )}
          >
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {mode === 'edit' ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text font-mono placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors',
            error && 'border-red-500'
          )}
        />
      ) : (
        <div
          className="w-full min-h-[140px] rounded-md border border-border bg-bg/50 px-4 py-3 text-sm text-text font-sans prose prose-invert max-w-none overflow-y-auto"
        >
          {value ? (
            <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
          ) : (
            <p className="text-xs font-mono text-muted italic">Nothing to preview</p>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-mono">{error}</p>}
    </div>
  )
}
