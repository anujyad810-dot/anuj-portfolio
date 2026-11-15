import React, { useState } from 'react'
import { Plus, Trash2, Edit, Cpu, FolderPlus } from 'lucide-react'
import { useSkillsWithGroups } from '@/lib/queries'
import {
  createSkill,
  updateSkill,
  deleteSkill,
  createSkillGroup,
  deleteSkillGroup,
} from '../lib/mutations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Dialog } from '@/components/ui/Dialog'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'

export default function AdminSkills() {
  const { toast } = useToast()
  const { data: skillsData, isLoading } = useSkillsWithGroups()

  // Add / Edit Skill modal state
  const [skillModalOpen, setSkillModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<any | null>(null)
  const [skillName, setSkillName] = useState('')
  const [skillLevel, setSkillLevel] = useState<'Strong' | 'Comfortable' | 'Learning'>('Strong')
  const [skillGroupId, setSkillGroupId] = useState('')

  // Add Group modal state
  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  // Delete confirm
  const [deleteSkillConfirm, setDeleteSkillConfirm] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleOpenAddSkill = (groupId?: string) => {
    setEditingSkill(null)
    setSkillName('')
    setSkillLevel('Strong')
    setSkillGroupId(groupId || skillsData?.groups?.[0]?.id || '')
    setSkillModalOpen(true)
  }

  const handleOpenEditSkill = (skill: any) => {
    setEditingSkill(skill)
    setSkillName(skill.name)
    setSkillLevel(skill.level)
    setSkillGroupId(skill.group_id)
    setSkillModalOpen(true)
  }

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!skillName.trim() || !skillGroupId) return
    setSubmitting(true)
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, {
          name: skillName.trim(),
          level: skillLevel,
          group_id: skillGroupId,
        })
        toast({ title: 'Skill Updated', description: `${skillName} updated.`, type: 'success' })
      } else {
        await createSkill({
          name: skillName.trim(),
          level: skillLevel,
          group_id: skillGroupId,
          sort_order: 0,
          icon: null,
        })
        toast({ title: 'Skill Added', description: `${skillName} added to stack.`, type: 'success' })
      }
      setSkillModalOpen(false)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSkill = async () => {
    if (!deleteSkillConfirm) return
    setSubmitting(true)
    try {
      await deleteSkill(deleteSkillConfirm.id)
      toast({ title: 'Skill Deleted', description: 'Skill removed.', type: 'info' })
      setDeleteSkillConfirm(null)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim()) return
    setSubmitting(true)
    try {
      await createSkillGroup(newGroupName.trim().toLowerCase())
      toast({ title: 'Group Created', description: `Group '${newGroupName}' added.`, type: 'success' })
      setNewGroupName('')
      setGroupModalOpen(false)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Skills & Technology Stack</h1>
          <p className="text-xs text-muted font-sans mt-0.5">
            Organize skill groups and individual competencies shown on the live /stack route.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setGroupModalOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-1" />
            <span>New Group</span>
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleOpenAddSkill()}>
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Skill</span>
          </Button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="space-y-6">
        {skillsData?.groups?.map((group) => {
          const groupSkills = skillsData.skills.filter((s) => s.group_id === group.id)

          return (
            <div
              key={group.id}
              className="rounded-xl border border-border bg-panel p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-accent" />
                  <h2 className="font-bold text-sm text-text uppercase tracking-wider">
                    {group.name}
                  </h2>
                  <span className="text-xs text-muted">({groupSkills.length})</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenAddSkill(group.id)}
                  className="text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span>Add to {group.name}</span>
                </Button>
              </div>

              {groupSkills.length === 0 ? (
                <p className="text-xs text-muted py-2">No skills in this group yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-lg border border-border bg-bg px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-text">{skill.name}</p>
                        <p
                          className={`text-[10px] font-bold ${
                            skill.level === 'Strong'
                              ? 'text-green'
                              : skill.level === 'Comfortable'
                              ? 'text-accent'
                              : 'text-orange'
                          }`}
                        >
                          {skill.level}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSkill(skill)}
                          className="p-1 text-muted hover:text-accent rounded"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteSkillConfirm(skill)}
                          className="p-1 text-muted hover:text-red-500 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add / Edit Skill Modal */}
      {skillModalOpen && (
        <Dialog
          open={skillModalOpen}
          onOpenChange={setSkillModalOpen}
          title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveSkill} className="space-y-4 text-xs font-mono">
            <Input
              label="Skill Name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g. React, Docker, PyTorch"
              required
            />

            <Select
              label="Skill Group"
              value={skillGroupId}
              onChange={(e) => setSkillGroupId(e.target.value)}
              options={skillsData?.groups?.map((g) => ({ value: g.id, label: g.name }))}
            />

            <Select
              label="Competency Level"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as any)}
              options={[
                { value: 'Strong', label: 'Strong (Production Mastery)' },
                { value: 'Comfortable', label: 'Comfortable (Experienced)' },
                { value: 'Learning', label: 'Learning (Actively exploring)' },
              ]}
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="secondary" size="sm" onClick={() => setSkillModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={submitting}>
                Save Skill
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Add Group Modal */}
      {groupModalOpen && (
        <Dialog open={groupModalOpen} onOpenChange={setGroupModalOpen} title="New Skill Group" maxWidth="max-w-sm">
          <form onSubmit={handleCreateGroup} className="space-y-4 text-xs font-mono">
            <Input
              label="Group Name (slug)"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g. cloud, mobile, devops"
              required
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="secondary" size="sm" onClick={() => setGroupModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={submitting}>
                Create Group
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Delete Confirm */}
      {deleteSkillConfirm && (
        <ConfirmDialog
          open={!!deleteSkillConfirm}
          onOpenChange={(open) => !open && setDeleteSkillConfirm(null)}
          title="Delete Skill"
          message={`Are you sure you want to delete ${deleteSkillConfirm.name}?`}
          confirmText="Delete"
          onConfirm={handleDeleteSkill}
          loading={submitting}
        />
      )}
    </div>
  )
}
