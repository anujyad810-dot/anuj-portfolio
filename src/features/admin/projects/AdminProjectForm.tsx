import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, ProjectFormData } from '@/lib/schemas'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Toggle } from '@/components/ui/Toggle'
import { TagInput } from '@/components/ui/TagInput'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Dialog } from '@/components/ui/Dialog'
import { createProject, updateProject } from '../lib/mutations'
import { useToast } from '@/components/ui/Toast'

export interface AdminProjectFormProps {
  open: boolean
  onClose: () => void
  project?: any | null
}

export function AdminProjectForm({ open, onClose, project }: AdminProjectFormProps) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const isEditing = !!project

  const [coverUrl, setCoverUrl] = useState<string>(project?.cover_url || '')
  const [logoUrl, setLogoUrl] = useState<string>(project?.logo_url || '')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: {
      title: project?.title || '',
      slug: project?.slug || '',
      category: project?.category || 'web',
      language: project?.language || 'tsx',
      short_description: project?.short_description || '',
      outcome: project?.outcome || '',
      problem_md: project?.problem_md || '',
      role_md: project?.role_md || '',
      features: project?.features || [],
      learned_md: project?.learned_md || '',
      tech: project?.tech || [],
      demo_url: project?.demo_url || '',
      github_url: project?.github_url || '',
      video_url: project?.video_url || '',
      featured: project?.featured ?? false,
      published: project?.published ?? true,
      sort_order: project?.sort_order || 0,
    },
  })

  const watchTitle = watch('title')

  // Auto-slugify title if slug is empty
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue('title', val)
    if (!isEditing) {
      setValue('slug', slugify(val))
    }
  }

  const onSubmit = async (data: ProjectFormData) => {
    setSubmitting(true)
    try {
      const payload = {
        ...data,
        cover_url: coverUrl || null,
        logo_url: logoUrl || null,
        gallery: project?.gallery || [],
      }

      if (isEditing) {
        await updateProject(project.id, payload as any)
        toast({ title: 'Project Updated', description: `${data.title} has been updated.`, type: 'success' })
      } else {
        await createProject(payload as any)
        toast({ title: 'Project Created', description: `${data.title} has been added.`, type: 'success' })
      }
      onClose()
    } catch (err: any) {
      console.error('Save project error:', err)
      toast({ title: 'Save Failed', description: err.message || 'Error saving project.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={isEditing ? `Edit Project: ${project.title}` : 'Add New Project'}
      description="Fill in case study details, media assets, and technical badges."
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-mono text-xs">
        {/* Basic Row: Title & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Project Title"
            error={errors.title?.message}
            {...register('title')}
            onChange={handleTitleChange}
            placeholder="e.g. DevConnect"
          />

          <Input
            label="Slug (URL identifier)"
            error={errors.slug?.message}
            {...register('slug')}
            placeholder="e.g. devconnect"
          />
        </div>

        {/* Category & Language badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            error={errors.category?.message}
            {...register('category')}
            options={[
              { value: 'web', label: 'Web Application (--web)' },
              { value: 'ml', label: 'Machine Learning / AI (--ml)' },
              { value: 'design', label: 'UI/UX Design (--design)' },
              { value: 'other', label: 'Other Tooling (--other)' },
            ]}
          />

          <Input
            label="Language / File Extension"
            error={errors.language?.message}
            {...register('language')}
            placeholder="tsx, py, js, rust"
          />
        </div>

        {/* Short Description */}
        <Textarea
          label="Short Description (Max 200 chars)"
          rows={2}
          error={errors.short_description?.message}
          {...register('short_description')}
          placeholder="One or two sentences summarizing the project for cards."
        />

        {/* Outcome Line */}
        <Input
          label="Key Outcome / Metric"
          error={errors.outcome?.message}
          {...register('outcome')}
          placeholder="e.g. Increased engagement by 60% in beta testing"
        />

        {/* Images: Cover & Logo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUpload
            label="Cover Image"
            value={coverUrl}
            onChange={setCoverUrl}
            folder="projects"
          />
          <ImageUpload
            label="Project Logo (Optional)"
            value={logoUrl}
            onChange={setLogoUrl}
            folder="logos"
          />
        </div>

        {/* Tech Chips */}
        <Controller
          name="tech"
          control={control}
          render={({ field }) => (
            <TagInput
              label="Technologies Used (Press Enter to add)"
              tags={field.value || []}
              onChange={field.onChange}
              placeholder="React, Node.js, MongoDB..."
            />
          )}
        />

        {/* Key Features */}
        <Controller
          name="features"
          control={control}
          render={({ field }) => (
            <TagInput
              label="Key Features List"
              tags={field.value || []}
              onChange={field.onChange}
              placeholder="Real-time chat, OAuth auth..."
            />
          )}
        />

        {/* Markdown Sections */}
        <div className="space-y-4 pt-2 border-t border-border/60">
          <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
            Detailed Markdown Case Study Sections
          </h4>

          <Controller
            name="problem_md"
            control={control}
            render={({ field }) => (
              <MarkdownEditor
                label="Problem Statement"
                value={field.value || ''}
                onChange={field.onChange}
                rows={4}
                placeholder="What challenge does this project solve?"
              />
            )}
          />

          <Controller
            name="role_md"
            control={control}
            render={({ field }) => (
              <MarkdownEditor
                label="My Role & Architecture"
                value={field.value || ''}
                onChange={field.onChange}
                rows={4}
                placeholder="How did you architect the system?"
              />
            )}
          />

          <Controller
            name="learned_md"
            control={control}
            render={({ field }) => (
              <MarkdownEditor
                label="Key Learnings & Takeaways"
                value={field.value || ''}
                onChange={field.onChange}
                rows={4}
                placeholder="What insights or technical skills did you gain?"
              />
            )}
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/60">
          <Input
            label="Live Demo URL"
            type="url"
            error={errors.demo_url?.message}
            {...register('demo_url')}
            placeholder="https://..."
          />
          <Input
            label="GitHub Repository URL"
            type="url"
            error={errors.github_url?.message}
            {...register('github_url')}
            placeholder="https://github.com/..."
          />
          <Input
            label="Demo Video Link"
            type="url"
            error={errors.video_url?.message}
            {...register('video_url')}
            placeholder="https://youtube.com/..."
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border/60">
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Toggle
                label="Featured Project (Highlights first)"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="published"
            control={control}
            render={({ field }) => (
              <Toggle
                label="Published (Visible on public site)"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Submit / Cancel Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={submitting}>
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
