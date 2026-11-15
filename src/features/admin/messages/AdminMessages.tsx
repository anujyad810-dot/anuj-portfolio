import React, { useState } from 'react'
import {
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { useMessages } from '@/lib/queries'
import { markMessageRead, deleteMessage } from '../lib/mutations'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'

export default function AdminMessages() {
  const { toast } = useToast()
  const { data: messages = [], isLoading } = useMessages()

  const [deleteConfirmMsg, setDeleteConfirmMsg] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleToggleRead = async (msg: any) => {
    try {
      await markMessageRead(msg.id, !msg.read)
      toast({
        title: msg.read ? 'Marked Unread' : 'Marked Read',
        description: `Message from ${msg.name}`,
        type: 'info',
      })
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmMsg) return
    setSubmitting(true)
    try {
      await deleteMessage(deleteConfirmMsg.id)
      toast({ title: 'Message Deleted', description: 'Message removed from inbox.', type: 'info' })
      setDeleteConfirmMsg(null)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <Inbox className="h-6 w-6 text-accent" />
            <span>Incoming Contact Inbox</span>
          </h1>
          <p className="text-xs text-muted font-sans mt-0.5">
            Messages dispatched from the public terminal contact form (./contact.sh).
          </p>
        </div>

        <div className="text-xs text-muted">
          Total transmissions: <span className="text-text font-bold">{messages.length}</span> (
          <span className="text-accent font-bold">
            {messages.filter((m) => !m.read).length} unread
          </span>
          )
        </div>
      </div>

      {/* Messages Stream */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-border bg-panel p-12 text-center text-xs text-muted">
            <Inbox className="h-10 w-10 text-muted mx-auto mb-2 opacity-50" />
            <p>Your inbox is clean. No transmissions recorded yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-5 transition-all space-y-3 ${
                !msg.read
                  ? 'border-accent/50 bg-panel shadow-md'
                  : 'border-border bg-panel/60'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-text">{msg.name}</span>
                    {!msg.read && (
                      <span className="rounded-full bg-accent text-[#0d1117] text-[10px] font-bold px-2 py-0.2">
                        NEW
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-accent hover:underline flex items-center gap-1 font-mono"
                  >
                    <Mail className="h-3 w-3" />
                    <span>{msg.email}</span>
                  </a>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(msg.created_at).toLocaleString()}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleRead(msg)}
                      className="p-1 rounded text-muted hover:text-text hover:bg-border/40 transition-colors"
                      title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {msg.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4 text-accent" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmMsg(msg)}
                      className="p-1 rounded text-muted hover:text-red-500 hover:bg-border/40 transition-colors"
                      title="Delete transmission"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="rounded-lg bg-bg border border-border/60 p-4 text-xs sm:text-sm text-text font-sans leading-relaxed whitespace-pre-wrap select-text">
                {msg.message}
              </div>

              {/* Quick Reply Link */}
              <div className="flex justify-end pt-1">
                <a
                  href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry&body=Hi ${msg.name},%0D%0A%0D%0AThank you for reaching out!`}
                  className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-semibold"
                >
                  <span>Reply by Email</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmMsg && (
        <ConfirmDialog
          open={!!deleteConfirmMsg}
          onOpenChange={(open) => !open && setDeleteConfirmMsg(null)}
          title="Delete Message"
          message={`Are you sure you want to permanently delete the message from ${deleteConfirmMsg.name}?`}
          confirmText="Delete"
          onConfirm={handleDelete}
          loading={submitting}
        />
      )}
    </div>
  )
}
