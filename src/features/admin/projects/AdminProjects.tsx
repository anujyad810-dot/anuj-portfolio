import React, { useState } from 'react'
import {
  Plus,
  Search,
  Star,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Layers,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react'
import { usePublicProjects } from '@/lib/queries'
import { updateProject, deleteProject, createProject } from '../lib/mutations'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AdminProjectForm } from './AdminProjectForm'
import { useToast } from '@/components/ui/Toast'

export default function AdminProjects() {
  const { toast } = useToast()
  const { data: projects = [], isLoading } = usePublicProjects('all')

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Modals state
  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any | null>(null)
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCat
  })

  const handleTogglePublished = async (project: any) => {
    try {
      await updateProject(project.id, { published: !project.published })
      toast({
        title: project.published ? 'Project Unpublished' : 'Project Published',
        description: `${project.title} status updated.`,
        type: 'success',
      })
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    }
  }

  const handleToggleFeatured = async (project: any) => {
    try {
      await updateProject(project.id, { featured: !project.featured })
      toast({
        title: project.featured ? 'Removed from Featured' : 'Marked as Featured',
        description: `${project.title} updated.`,
        type: 'success',
      })
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    }
  }

  const handleDuplicate = async (project: any) => {
    try {
      const duplicateData = {
        ...project,
        title: `${project.title} (Copy)`,
        slug: `${project.slug}-copy-${Date.now().toString().slice(-4)}`,
        published: false,
      }
      delete duplicateData.id
      delete duplicateData.created_at
      delete duplicateData.updated_at

      await createProject(duplicateData)
      toast({ title: 'Project Duplicated', description: 'Created draft copy.', type: 'success' })
    } catch (err: any) {
      toast({ title: 'Error Duplicating', description: err.message, type: 'error' })
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmProject) return
    setIsDeleting(true)
    try {
      await deleteProject(deleteConfirmProject.id)
      toast({ title: 'Project Deleted', description: 'Project was permanently removed.', type: 'info' })
      setDeleteConfirmProject(null)
    } catch (err: any) {
      toast({ title: 'Error Deleting', description: err.message, type: 'error' })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Manage Projects</h1>
          <p className="text-xs text-muted font-sans mt-0.5">
            Create, edit case studies, upload gallery images, and toggle live publish states.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingProject(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Add New Project</span>
        </Button>
      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border border-border bg-panel p-3">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="h-4 w-4 text-muted shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title or slug..."
            className="w-full bg-transparent text-xs text-text outline-none placeholder:text-muted/60"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {['all', 'web', 'ml', 'design'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded px-2.5 py-1 uppercase text-[11px] transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-accent text-[#0d1117] font-semibold'
                  : 'text-muted hover:text-text hover:bg-border/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-lg border border-border bg-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-bg/40 text-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Title / Slug</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Featured</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-border/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-text flex items-center gap-2">
                        <span>{project.title}</span>
                        {project.featured && (
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-muted font-mono mt-0.5">
                        {project.slug}.{project.language || 'tsx'}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <Badge variant="accent" className="text-[10px] uppercase">
                        {project.category}
                      </Badge>
                    </td>

                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1 rounded hover:bg-border/40 transition-colors ${
                          project.featured ? 'text-yellow-400' : 'text-muted hover:text-yellow-400'
                        }`}
                        title={project.featured ? 'Featured' : 'Mark featured'}
                      >
                        <Star className={`h-4 w-4 ${project.featured ? 'fill-yellow-400' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(project)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold cursor-pointer transition-colors ${
                          project.published
                            ? 'bg-green/15 text-green border border-green/30'
                            : 'bg-border/60 text-muted'
                        }`}
                        title="Click to toggle published status"
                      >
                        {project.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{project.published ? 'Live' : 'Draft'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(project)
                            setFormOpen(true)
                          }}
                          className="rounded p-1.5 text-muted hover:text-accent hover:bg-border/40 transition-colors"
                          title="Edit project"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicate(project)}
                          className="rounded p-1.5 text-muted hover:text-text hover:bg-border/40 transition-colors"
                          title="Duplicate project"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmProject(project)}
                          className="rounded p-1.5 text-muted hover:text-red-500 hover:bg-border/40 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Form Modal */}
      {formOpen && (
        <AdminProjectForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false)
            setEditingProject(null)
          }}
          project={editingProject}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmProject && (
        <ConfirmDialog
          open={!!deleteConfirmProject}
          onOpenChange={(open) => !open && setDeleteConfirmProject(null)}
          title="Delete Project"
          message={`Are you sure you want to permanently delete "${deleteConfirmProject.title}"? This action cannot be reversed.`}
          confirmText="Delete Permanently"
          onConfirm={handleDelete}
          loading={isDeleting}
        />
      )}
    </div>
  )
}
