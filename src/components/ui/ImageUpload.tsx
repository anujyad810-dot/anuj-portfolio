import React, { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import { UploadCloud, X, Check, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { fileToDataUrl, addStoredMedia } from '@/lib/storage-bridge'
import { Spinner } from './Spinner'
import { cn } from '@/lib/utils'

export interface ImageUploadProps {
  label?: string
  value?: string | null
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  error?: string
  className?: string
}

export function ImageUpload({
  label,
  value,
  onChange,
  bucket = 'portfolio-media',
  folder = 'images',
  error,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(15)
    setUploadError(null)

    try {
      let fileToUpload = file

      // Compress if jpg/png/webp
      if (file.type.match(/image\/(jpeg|png|webp)/i)) {
        try {
          const options = {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
            onProgress: (p: number) => setProgress(Math.min(50, Math.round(p * 0.5))),
          }
          fileToUpload = await imageCompression(file, options)
        } catch (compressionErr) {
          console.warn('Image compression skipped:', compressionErr)
        }
      }

      setProgress(60)

      let finalUrl = ''

      // Attempt Supabase storage upload if configured
      if (isSupabaseConfigured()) {
        try {
          const fileExt = file.name.split('.').pop()
          const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

          const { data, error: uploadErr } = await supabase.storage
            .from(bucket)
            .upload(fileName, fileToUpload, {
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
          // Fall back to data URL
          finalUrl = await fileToDataUrl(fileToUpload)
        }
      } else {
        // Fall back to persistent Base64 Data URL
        finalUrl = await fileToDataUrl(fileToUpload)
      }

      setProgress(90)
      onChange(finalUrl)

      // Record in local media store for quick reuse
      addStoredMedia({
        name: file.name,
        url: finalUrl,
        created_at: new Date().toISOString(),
        size: file.size,
      })

      setProgress(100)
    } catch (err: any) {
      console.error('Upload failed:', err)
      setUploadError(err.message || 'Image processing failed.')
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
        <div className="relative inline-block rounded-xl border border-border bg-bg overflow-hidden group shadow-xs">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-auto max-w-full object-cover rounded-xl"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 rounded-full bg-red-600/90 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer shadow-md"
            title="Remove image"
          >
            <X className="h-3.5 w-3.5" />
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
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" />
              <span className="text-xs font-mono text-muted">
                Processing image... {progress}%
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-muted">
              <UploadCloud className="h-8 w-8 text-accent/80" />
              <p className="text-xs font-mono text-text">Click or drag image to upload</p>
              <p className="text-[11px] font-mono text-muted">PNG, JPG, WebP, SVG</p>
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
