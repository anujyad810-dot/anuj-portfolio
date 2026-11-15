import React, { useState } from 'react'
import { Plus, Edit, Trash2, GitCommit, Calendar } from 'lucide-react'
import { useExperience } from '@/lib/queries'
import { createExperience, updateExperience, deleteExperience } from '../lib/mutations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'
import { Dialog } from '@/components/ui/Dialog'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'

export default function AdminExperience() {
  const { toast } = useToast()
  const { data: experiences = [], isLoading } = useExperience()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingExp, setEditingExp] = useState<any | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [descriptionMd, setDescriptionMd] = useState('')

  const handleOpenAdd = () => {
    setEditingExp(null)
    setTitle('')
    setOrganisation('')
    setStartDate('')
    setEndDate('present')
    setDescriptionMd('')
    setModalOpen(true)
  }

  const handleOpenEdit = (exp: any) => {
    setEditingExp(exp)
    setTitle(exp.title)
    setOrganisation(exp.organisation)
    setStartDate(exp.start_date)
    setEndDate(exp.end_date || 'present')
    setDescriptionMd(exp.description_md || '')
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !organisation.trim() || !startDate.trim()) return

    setSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        organisation: organisation.trim(),
        start_date: startDate.trim(),
        end_date: endDate.trim() || null,
        description_md: descriptionMd,
        sort_order: editingExp?.sort_order || 0,
      }

      if (editingExp) {
        await updateExperience(editingExp.id, payload)
        toast({ title: 'Experience Updated', description: `${title} updated.`, type: 'success' })
      } else {
        await createExperience(payload)
        toast({ title: 'Experience Added', description: `${title} added to git-log timeline.`, type: 'success' })
      }
      setModalOpen(false)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    setSubmitting(true)
    try {
      await deleteExperience(deleteConfirm.id)
      toast({ title: 'Experience Deleted', description: 'Entry removed.', type: 'info' })
      setDeleteConfirm(null)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Experience & Leadership (Git Log)</h1>
          <p className="text-xs text-muted font-sans mt-0.5">
            Manage roles, clubs, internships, and technical leadership shown in the git log timeline.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Position</span>
        </Button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-xl border border-border bg-panel p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <GitCommit className="h-4 w-4 text-accent shrink-0" />
                <h3 className="font-bold text-base text-text">{exp.title}</h3>
                <span className="text-xs text-green font-semibold">@ {exp.organisation}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {formatDate(exp.start_date)} — {formatDate(exp.end_date || 'present')}
                </span>
              </div>

              <p className="text-xs text-muted font-sans leading-relaxed line-clamp-2">
                {exp.description_md}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEdit(exp)}
                className="p-1.5 text-muted hover:text-accent rounded hover:bg-border/40 transition-colors"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(exp)}
                className="p-1.5 text-muted hover:text-red-500 rounded hover:bg-border/40 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Experience Form Modal */}
      {modalOpen && (
        <Dialog
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={editingExp ? 'Edit Position' : 'Add Position'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Role / Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Technical Lead"
                required
              />
              <Input
                label="Organisation / Club / Company"
                value={organisation}
                onChange={(e) => setOrganisation(e.target.value)}
                placeholder="e.g. ML Research Club, MITS"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date (YYYY-MM)"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="2024-08"
                required
              />
              <Input
                label="End Date (YYYY-MM or 'present')"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="present"
              />
            </div>

            <MarkdownEditor
              label="Detailed Description & Responsibilities (Markdown)"
              value={descriptionMd}
              onChange={setDescriptionMd}
              rows={5}
              placeholder="Detail leadership achievements, technical contributions, workshops..."
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={submitting}>
                Save Position
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <ConfirmDialog
          open={!!deleteConfirm}
          onOpenChange={(open) => !open && setDeleteConfirm(null)}
          title="Delete Experience Entry"
          message={`Are you sure you want to delete ${deleteConfirm.title}?`}
          confirmText="Delete"
          onConfirm={handleDelete}
          loading={submitting}
        />
      )}
    </div>
  )
}
