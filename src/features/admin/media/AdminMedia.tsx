import React, { useState, useEffect } from 'react'
import { Image, Copy, Trash2, Upload, ExternalLink, Check, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getStoredMedia, deleteStoredMedia } from '@/lib/storage-bridge'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'

interface MediaFile {
  name: string
  id?: string | null
  created_at?: string | null
  metadata?: any
  url: string
}

export default function AdminMedia() {
  const { toast } = useToast()
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null)
  const [uploadUrl, setUploadUrl] = useState('')

  const fetchFiles = async () => {
    setLoading(true)
    const localItems = getStoredMedia().map((m) => ({
      name: m.name,
      url: m.url,
      created_at: m.created_at,
    }))

    if (!isSupabaseConfigured()) {
      setFiles(localItems)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.storage.from('portfolio-media').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

      if (error) {
        console.warn('Storage list error:', error)
        setFiles(localItems)
        return
      }

      const filesWithUrls = (data || []).map((f) => {
        const { data: urlData } = supabase.storage.from('portfolio-media').getPublicUrl(f.name)
        return {
          ...f,
          url: urlData.publicUrl,
        }
      })

      // Combine cloud files and local files (avoiding duplicate URLs)
      const urlSet = new Set(filesWithUrls.map((f) => f.url))
      const combined = [
        ...filesWithUrls,
        ...localItems.filter((f) => !urlSet.has(f.url)),
      ]

      setFiles(combined)
    } catch (err) {
      console.error(err)
      setFiles(localItems)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const copyToClipboard = (file: MediaFile) => {
    navigator.clipboard.writeText(file.url)
    setCopiedId(file.name)
    toast({ title: 'Copied to Clipboard', description: 'Asset URL ready to paste.', type: 'info' })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      deleteStoredMedia(deleteTarget.url)

      if (isSupabaseConfigured() && !deleteTarget.url.startsWith('data:')) {
        await supabase.storage.from('portfolio-media').remove([deleteTarget.name])
      }

      toast({ title: 'File Deleted', description: `${deleteTarget.name} was removed.`, type: 'info' })
      setDeleteTarget(null)
      fetchFiles()
    } catch (err: any) {
      toast({ title: 'Delete Failed', description: err.message || 'Error deleting file', type: 'error' })
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Media Asset Library</h1>
          <p className="text-xs text-muted font-sans mt-0.5">
            Manage images and files stored in the portfolio media storage.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={fetchFiles} loading={loading}>
          <span>Refresh Library</span>
        </Button>
      </div>

      {/* Upload Zone */}
      <div className="rounded-xl border border-border bg-panel p-5">
        <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3">
          Upload New Asset
        </h3>
        <ImageUpload
          value={uploadUrl}
          onChange={(url) => {
            setUploadUrl(url)
            if (url) {
              fetchFiles()
              toast({ title: 'Uploaded', description: 'Asset ready in media library.', type: 'success' })
            }
          }}
          folder="uploads"
        />
      </div>

      {/* Grid of Files */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-panel border border-border" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-xl border border-border bg-panel p-12 text-center text-muted">
          <Image className="h-10 w-10 mx-auto mb-2 text-muted/60" />
          <p className="text-sm">No media files found.</p>
          <p className="text-xs text-muted/70 mt-1">Upload an image above to start your asset library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="rounded-xl border border-border bg-panel overflow-hidden group hover:border-accent/60 transition-all flex flex-col justify-between"
            >
              <div className="h-32 w-full bg-bg overflow-hidden relative">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-3 space-y-2 text-xs">
                <p className="truncate text-text font-semibold" title={file.name}>
                  {file.name}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-muted">
                  <button
                    onClick={() => copyToClipboard(file)}
                    className="hover:text-accent p-1 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedId === file.name ? (
                      <Check className="h-3.5 w-3.5 text-green" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span className="text-[10px]">Copy</span>
                  </button>

                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent p-1 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    onClick={() => setDeleteTarget(file)}
                    className="hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(isOpen) => !isOpen && setDeleteTarget(null)}
        title="Delete Media File"
        message={`Are you sure you want to delete '${deleteTarget?.name}'?`}
        confirmText="Delete File"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  )
}
