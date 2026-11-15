import React, { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'

export interface TagInputProps {
  label?: string
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  error?: string
  className?: string
}

export function TagInput({
  label,
  tags = [],
  onChange,
  placeholder = 'Type and press Enter...',
  error,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const trimmed = inputValue.trim()
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed])
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    <div className={cn('w-full space-y-1', className)}>
      {label && (
        <label className="block text-xs font-mono text-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-bg p-2 min-h-[42px] focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
        {tags.map((tag, index) => (
          <Badge key={index} variant="accent" className="flex items-center gap-1 py-1">
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-muted hover:text-text hover:bg-border/40 rounded p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm font-mono text-text outline-none placeholder:text-muted/60"
        />
      </div>
      {error && <p className="text-xs text-red-500 font-mono">{error}</p>}
    </div>
  )
}
