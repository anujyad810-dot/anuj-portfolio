import React, { useState, useRef } from 'react'
import { FileText, UploadCloud, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { fileToDataUrl } from '@/lib/storage-bridge'
import { Spinner } from './Spinner'
import { cn } from '@/lib/utils'

export interface FileUploadProps {
  label?: string
  value?: string | null
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  accept?: string
  error?: string
  className?: string
}

export function FileUpload({
  label,
  value,
  onChange,
  bucket = 'resume',
  folder = 'docs',
  accept = '.pdf,application/pdf',
  error,
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      let finalUrl = ''

      if (isSupabaseConfigured()) {
        try {
          const fileExt = file.name.split('.').pop()
          const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

          const { data, error: uploadErr } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
            })

          if (uploadErr) {
            throw uploadErr
          }

          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path)

          finalUrl = publicUrlData.publicUrl
        } catch (cloudErr: any) {
          console.warn('Cloud storage failed, falling back to local data URL:', cloudErr)
          finalUrl = await fileToDataUrl(file)
        }
      } else {
        // Fall back to persistent Base64 Data URL
        finalUrl = await fileToDataUrl(file)
      }

      onChange(finalUrl)
    } catch (err: any) {
      console.error('File upload failed:', err)
      setUploadError(err.message || 'File upload failed.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {label && (
        <label className="block text-xs font-mono text-muted uppercase tracking-wider">
          {label}
        </label>
      )}

      {value ? (
        <div className="flex items-center justify-between rounded-xl border border-border bg-bg px-4 py-3 shadow-xs">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="h-6 w-6 text-accent shrink-0" />
            <div className="truncate">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-accent hover:underline font-semibold block truncate"
              >
                {value.startsWith('data:') ? 'Resume_Document.pdf (Local)' : value.split('/').pop() || 'Uploaded Document'}
              </a>
              <span className="text-[10px] text-muted">Ready for preview and download</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg p-1.5 text-muted hover:text-red-500 hover:bg-panel transition-colors cursor-pointer"
            title="Remove document"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-accent/60 bg-panel/50 p-6 text-center cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" />
              <span className="text-xs font-mono text-muted">Processing document...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-muted">
              <UploadCloud className="h-8 w-8 text-accent/80" />
              <p className="text-xs font-mono text-text">Click to upload document (PDF)</p>
              <p className="text-[11px] font-mono text-muted">Max 10MB</p>
            </div>
          )}
        </div>
      )}

      {(error || uploadError) && (
        <p className="flex items-center gap-1 text-xs text-red-500 font-mono">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error || uploadError}</span>
        </p>
      )}
    </div>
  )
}
