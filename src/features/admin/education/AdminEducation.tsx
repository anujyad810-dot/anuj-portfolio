import React, { useState } from 'react'
import { Plus, Edit, Trash2, GraduationCap, Award, Calendar, Eye, EyeOff } from 'lucide-react'
import { useEducation, useCertificates } from '@/lib/queries'
import {
  createEducation,
  updateEducation,
  deleteEducation,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../lib/mutations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Toggle } from '@/components/ui/Toggle'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Dialog } from '@/components/ui/Dialog'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'

export default function AdminEducation() {
  const { toast } = useToast()
  const { data: educationList = [] } = useEducation()
  const { data: certificates = [] } = useCertificates()

  // Education state
  const [eduModalOpen, setEduModalOpen] = useState(false)
  const [editingEdu, setEditingEdu] = useState<any | null>(null)
  const [eduDegree, setEduDegree] = useState('')
  const [eduInstitute, setEduInstitute] = useState('')
  const [eduStartYear, setEduStartYear] = useState(2024)
  const [eduEndYear, setEduEndYear] = useState<number | ''>(2028)
  const [eduDesc, setEduDesc] = useState('')

  // Certificate state
  const [certModalOpen, setCertModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<any | null>(null)
  const [certTitle, setCertTitle] = useState('')
  const [certIssuer, setCertIssuer] = useState('')
  const [certDate, setCertDate] = useState('')
  const [certImageUrl, setCertImageUrl] = useState('')
  const [certVisible, setCertVisible] = useState(true)

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'edu' | 'cert'; item: any } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Handle Education
  const handleOpenAddEdu = () => {
    setEditingEdu(null)
    setEduDegree('')
    setEduInstitute('')
    setEduStartYear(2024)
    setEduEndYear(2028)
    setEduDesc('')
    setEduModalOpen(true)
  }

  const handleOpenEditEdu = (edu: any) => {
    setEditingEdu(edu)
    setEduDegree(edu.degree)
    setEduInstitute(edu.institute)
    setEduStartYear(edu.start_year)
    setEduEndYear(edu.end_year || '')
    setEduDesc(edu.description || '')
    setEduModalOpen(true)
  }

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        degree: eduDegree,
        institute: eduInstitute,
        start_year: Number(eduStartYear),
        end_year: eduEndYear ? Number(eduEndYear) : null,
        description: eduDesc || null,
        sort_order: 0,
      }
      if (editingEdu) {
        await updateEducation(editingEdu.id, payload)
        toast({ title: 'Education Updated', description: eduDegree, type: 'success' })
      } else {
        await createEducation(payload)
        toast({ title: 'Education Added', description: eduDegree, type: 'success' })
      }
      setEduModalOpen(false)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Certificate
  const handleOpenAddCert = () => {
    setEditingCert(null)
    setCertTitle('')
    setCertIssuer('')
    setCertDate('')
    setCertImageUrl('')
    setCertVisible(true)
    setCertModalOpen(true)
  }

  const handleOpenEditCert = (cert: any) => {
    setEditingCert(cert)
    setCertTitle(cert.title)
    setCertIssuer(cert.issuer)
    setCertDate(cert.issued_on)
    setCertImageUrl(cert.image_url || '')
    setCertVisible(cert.visible)
    setCertModalOpen(true)
  }

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        title: certTitle,
        issuer: certIssuer,
        issued_on: certDate,
        image_url: certImageUrl || null,
        visible: certVisible,
        sort_order: 0,
      }
      if (editingCert) {
        await updateCertificate(editingCert.id, payload)
        toast({ title: 'Certificate Updated', description: certTitle, type: 'success' })
      } else {
        await createCertificate(payload)
        toast({ title: 'Certificate Added', description: certTitle, type: 'success' })
      }
      setCertModalOpen(false)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog) return
    setSubmitting(true)
    try {
      if (deleteDialog.type === 'edu') {
        await deleteEducation(deleteDialog.item.id)
        toast({ title: 'Education Deleted', description: 'Item removed.', type: 'info' })
      } else {
        await deleteCertificate(deleteDialog.item.id)
        toast({ title: 'Certificate Deleted', description: 'Item removed.', type: 'info' })
      }
      setDeleteDialog(null)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 font-mono">
      {/* 1. Education Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-accent" />
              <span>Academics & Degrees</span>
            </h1>
            <p className="text-xs text-muted font-sans mt-0.5">
              Degrees, institutes, and academic descriptions.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleOpenAddEdu}>
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Degree</span>
          </Button>
        </div>

        <div className="space-y-3">
          {educationList.map((edu) => (
            <div
              key={edu.id}
              className="rounded-lg border border-border bg-panel p-4 flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-bold text-sm text-text">{edu.degree}</h3>
                <p className="text-xs text-accent mt-0.5">
                  {edu.institute} ({edu.start_year} - {edu.end_year || 'Present'})
                </p>
                {edu.description && (
                  <p className="text-xs text-muted font-sans mt-1">{edu.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEditEdu(edu)}
                  className="p-1.5 text-muted hover:text-accent rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteDialog({ type: 'edu', item: edu })}
                  className="p-1.5 text-muted hover:text-red-500 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Certificates Section */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <span>Certificates & Accreditations</span>
            </h2>
            <p className="text-xs text-muted font-sans mt-0.5">
              Certificates displayed in the public grid with image lightbox previews.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleOpenAddCert}>
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Certificate</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="rounded-lg border border-border bg-panel p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {cert.image_url ? (
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="h-28 w-full object-cover rounded border border-border/60"
                  />
                ) : (
                  <div className="h-28 w-full rounded border border-border/60 bg-bg flex items-center justify-center text-muted">
                    <Award className="h-8 w-8 text-yellow-400/60" />
                  </div>
                )}
                <h4 className="font-bold text-xs text-text">{cert.title}</h4>
                <p className="text-[11px] text-muted">
                  {cert.issuer} • {cert.issued_on}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] ${
                    cert.visible ? 'text-green' : 'text-muted'
                  }`}
                >
                  {cert.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  <span>{cert.visible ? 'Visible' : 'Hidden'}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCert(cert)}
                    className="p-1 text-muted hover:text-accent rounded"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteDialog({ type: 'cert', item: cert })}
                    className="p-1 text-muted hover:text-red-500 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Modal */}
      {eduModalOpen && (
        <Dialog open={eduModalOpen} onOpenChange={setEduModalOpen} title={editingEdu ? 'Edit Degree' : 'Add Degree'} maxWidth="max-w-md">
          <form onSubmit={handleSaveEdu} className="space-y-4 text-xs font-mono">
            <Input label="Degree / Branch" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} required />
            <Input label="Institute / University" value={eduInstitute} onChange={(e) => setEduInstitute(e.target.value)} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Year" type="number" value={eduStartYear} onChange={(e) => setEduStartYear(Number(e.target.value))} required />
              <Input label="End Year (Optional)" type="number" value={eduEndYear} onChange={(e) => setEduEndYear(e.target.value ? Number(e.target.value) : '')} />
            </div>
            <Textarea label="Academic Description" value={eduDesc} onChange={(e) => setEduDesc(e.target.value)} rows={3} />
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="secondary" size="sm" onClick={() => setEduModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm" loading={submitting}>Save Degree</Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Certificate Modal */}
      {certModalOpen && (
        <Dialog open={certModalOpen} onOpenChange={setCertModalOpen} title={editingCert ? 'Edit Certificate' : 'Add Certificate'} maxWidth="max-w-md">
          <form onSubmit={handleSaveCert} className="space-y-4 text-xs font-mono">
            <Input label="Certificate Title" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} required />
            <Input label="Issuing Organization" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} required />
            <Input label="Issue Date (e.g. Oct 2024)" value={certDate} onChange={(e) => setCertDate(e.target.value)} required />
            <ImageUpload label="Certificate Image / Badge" value={certImageUrl} onChange={setCertImageUrl} folder="certificates" />
            <Toggle label="Visible on public site" checked={certVisible} onChange={setCertVisible} />
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="secondary" size="sm" onClick={() => setCertModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm" loading={submitting}>Save Certificate</Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {deleteDialog && (
        <ConfirmDialog
          open={!!deleteDialog}
          onOpenChange={(open) => !open && setDeleteDialog(null)}
          title={`Delete ${deleteDialog.type === 'edu' ? 'Degree' : 'Certificate'}`}
          message={`Are you sure you want to delete "${deleteDialog.item.title || deleteDialog.item.degree}"?`}
          confirmText="Delete"
          onConfirm={handleDelete}
          loading={submitting}
        />
      )}
    </div>
  )
}
