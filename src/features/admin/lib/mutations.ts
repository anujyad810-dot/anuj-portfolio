import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { queryClient } from '@/lib/queryClient'
import {
  SETTINGS_KEY,
  PROJECTS_KEY,
  SKILLS_KEY,
  EXPERIENCE_KEY,
  EDUCATION_KEY,
  CERTIFICATES_KEY,
  MESSAGES_KEY,
} from '@/lib/queries'
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredProjects,
  saveStoredProjects,
  getStoredSkills,
  saveStoredSkills,
  getStoredSkillGroups,
  saveStoredSkillGroups,
  getStoredExperience,
  saveStoredExperience,
  getStoredEducation,
  saveStoredEducation,
  getStoredCertificates,
  saveStoredCertificates,
  getStoredMessages,
  saveStoredMessages,
} from '@/lib/storage-bridge'
import type { Database, Project, Skill, SkillGroup, Experience, Education, Certificate, Message } from '@/lib/database.types'

type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

// --- SETTINGS ---
export async function updateSettings(settings: Partial<Database['public']['Tables']['settings']['Row']>) {
  let updatedData: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('settings')
        .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() })
        .select()
        .single()

      if (!error && data) {
        updatedData = data
      }
    } catch (err) {
      console.warn('Supabase settings update failed, falling back to local storage:', err)
    }
  }

  // Local fallback / persistent cache
  const current = getStoredSettings() || {}
  const merged = {
    ...current,
    ...settings,
    id: 1,
    updated_at: new Date().toISOString(),
  }
  saveStoredSettings(merged as any)
  updatedData = updatedData || merged

  queryClient.setQueryData(SETTINGS_KEY, updatedData)
  await queryClient.invalidateQueries({ queryKey: SETTINGS_KEY })
  return updatedData
}

// --- PROJECTS ---
export async function createProject(project: ProjectInsert) {
  let newProject: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .insert(project)
        .select()
        .single()

      if (!error && data) {
        newProject = data
      }
    } catch (err) {
      console.warn('Supabase createProject failed, saving locally:', err)
    }
  }

  if (!newProject) {
    const current = getStoredProjects() || []
    newProject = {
      ...project,
      id: (project as any).id || crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Project
    saveStoredProjects([newProject, ...current])
  } else {
    const current = getStoredProjects() || []
    saveStoredProjects([newProject, ...current.filter((p) => p.id !== newProject.id)])
  }

  await queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })
  return newProject
}

export async function updateProject(id: string, updates: ProjectUpdate) {
  let updatedProject: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (!error && data) {
        updatedProject = data
      }
    } catch (err) {
      console.warn('Supabase updateProject failed, saving locally:', err)
    }
  }

  const current = getStoredProjects() || []
  const existing = current.find((p) => p.id === id)
  const merged = {
    ...(existing || {}),
    ...updates,
    id,
    updated_at: new Date().toISOString(),
  } as Project

  const updatedList = current.some((p) => p.id === id)
    ? current.map((p) => (p.id === id ? merged : p))
    : [merged, ...current]

  saveStoredProjects(updatedList)
  updatedProject = updatedProject || merged

  await queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })
  return updatedProject
}

export async function deleteProject(id: string) {
  if (isSupabaseConfigured()) {
    try {
      await (supabase as any).from('projects').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase deleteProject failed, deleting locally:', err)
    }
  }

  const current = getStoredProjects() || []
  saveStoredProjects(current.filter((p) => p.id !== id))
  await queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })
}

// --- SKILL GROUPS & SKILLS ---
export async function createSkillGroup(name: string, sort_order: number = 0) {
  let newGroup: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('skill_groups')
        .insert({ name, sort_order })
        .select()
        .single()

      if (!error && data) newGroup = data
    } catch (err) {
      console.warn('Supabase createSkillGroup failed, saving locally:', err)
    }
  }

  if (!newGroup) {
    const current = getStoredSkillGroups() || []
    newGroup = { id: crypto.randomUUID(), name, sort_order } as SkillGroup
    saveStoredSkillGroups([...current, newGroup])
  }

  await queryClient.invalidateQueries({ queryKey: SKILLS_KEY })
  return newGroup
}

export async function deleteSkillGroup(id: string) {
  if (isSupabaseConfigured()) {
    try {
      await (supabase as any).from('skill_groups').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase deleteSkillGroup failed:', err)
    }
  }

  const current = getStoredSkillGroups() || []
  saveStoredSkillGroups(current.filter((g) => g.id !== id))
  await queryClient.invalidateQueries({ queryKey: SKILLS_KEY })
}

export async function createSkill(skill: Database['public']['Tables']['skills']['Insert']) {
  let newSkill: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('skills')
        .insert(skill)
        .select()
        .single()

      if (!error && data) newSkill = data
    } catch (err) {
      console.warn('Supabase createSkill failed, saving locally:', err)
    }
  }

  if (!newSkill) {
    const current = getStoredSkills() || []
    newSkill = { ...skill, id: (skill as any).id || crypto.randomUUID() } as Skill
    saveStoredSkills([...current, newSkill])
  }

  await queryClient.invalidateQueries({ queryKey: SKILLS_KEY })
  return newSkill
}

export async function updateSkill(id: string, updates: Database['public']['Tables']['skills']['Update']) {
  let updatedSkill: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (!error && data) updatedSkill = data
    } catch (err) {
      console.warn('Supabase updateSkill failed, saving locally:', err)
    }
  }

  const current = getStoredSkills() || []
  const updatedList = current.map((s) => (s.id === id ? { ...s, ...updates } : s))
  saveStoredSkills(updatedList as Skill[])

  await queryClient.invalidateQueries({ queryKey: SKILLS_KEY })
  return updatedSkill || { id, ...updates }
}

export async function deleteSkill(id: string) {
  if (isSupabaseConfigured()) {
    try {
      await (supabase as any).from('skills').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase deleteSkill failed:', err)
    }
  }

  const current = getStoredSkills() || []
  saveStoredSkills(current.filter((s) => s.id !== id))
  await queryClient.invalidateQueries({ queryKey: SKILLS_KEY })
}

// --- EXPERIENCE ---
export async function createExperience(exp: Database['public']['Tables']['experience']['Insert']) {
  let newExp: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('experience')
        .insert(exp)
        .select()
        .single()

      if (!error && data) newExp = data
    } catch (err) {
      console.warn('Supabase createExperience failed, saving locally:', err)
    }
  }

  if (!newExp) {
    const current = getStoredExperience() || []
    newExp = { ...exp, id: (exp as any).id || crypto.randomUUID() } as Experience
    saveStoredExperience([newExp, ...current])
  }

  await queryClient.invalidateQueries({ queryKey: EXPERIENCE_KEY })
  return newExp
}

export async function updateExperience(id: string, updates: Database['public']['Tables']['experience']['Update']) {
  let updatedExp: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('experience')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (!error && data) updatedExp = data
    } catch (err) {
      console.warn('Supabase updateExperience failed, saving locally:', err)
    }
  }

  const current = getStoredExperience() || []
  const updatedList = current.map((e) => (e.id === id ? { ...e, ...updates } : e))
  saveStoredExperience(updatedList as Experience[])

  await queryClient.invalidateQueries({ queryKey: EXPERIENCE_KEY })
  return updatedExp || { id, ...updates }
}

export async function deleteExperience(id: string) {
  if (isSupabaseConfigured()) {
    try {
      await (supabase as any).from('experience').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase deleteExperience failed:', err)
    }
  }

  const current = getStoredExperience() || []
  saveStoredExperience(current.filter((e) => e.id !== id))
  await queryClient.invalidateQueries({ queryKey: EXPERIENCE_KEY })
}

// --- EDUCATION ---
export async function createEducation(edu: Database['public']['Tables']['education']['Insert']) {
  let newEdu: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('education')
        .insert(edu)
        .select()
        .single()

      if (!error && data) newEdu = data
    } catch (err) {
      console.warn('Supabase createEducation failed, saving locally:', err)
    }
  }

  if (!newEdu) {
    const current = getStoredEducation() || []
    newEdu = { ...edu, id: (edu as any).id || crypto.randomUUID() } as Education
    saveStoredEducation([newEdu, ...current])
  }

  await queryClient.invalidateQueries({ queryKey: EDUCATION_KEY })
  return newEdu
}

export async function updateEducation(id: string, updates: Database['public']['Tables']['education']['Update']) {
  let updatedEdu: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('education')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (!error && data) updatedEdu = data
    } catch (err) {
      console.warn('Supabase updateEducation failed, saving locally:', err)
    }
  }

  const current = getStoredEducation() || []
  const updatedList = current.map((e) => (e.id === id ? { ...e, ...updates } : e))
  saveStoredEducation(updatedList as Education[])

  await queryClient.invalidateQueries({ queryKey: EDUCATION_KEY })
  return updatedEdu || { id, ...updates }
}

export async function deleteEducation(id: string) {
  if (isSupabaseConfigured()) {
    try {
      await (supabase as any).from('education').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase deleteEducation failed:', err)
    }
  }

  const current = getStoredEducation() || []
  saveStoredEducation(current.filter((e) => e.id !== id))
  await queryClient.invalidateQueries({ queryKey: EDUCATION_KEY })
}

// --- CERTIFICATES ---
export async function createCertificate(cert: Database['public']['Tables']['certificates']['Insert']) {
  let newCert: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('certificates')
        .insert(cert)
        .select()
        .single()

      if (!error && data) newCert = data
    } catch (err) {
      console.warn('Supabase createCertificate failed, saving locally:', err)
    }
  }

  if (!newCert) {
    const current = getStoredCertificates() || []
    newCert = { ...cert, id: (cert as any).id || crypto.randomUUID() } as Certificate
    saveStoredCertificates([newCert, ...current])
  }

  await queryClient.invalidateQueries({ queryKey: CERTIFICATES_KEY })
  return newCert
}

export async function updateCertificate(id: string, updates: Database['public']['Tables']['certificates']['Update']) {
  let updatedCert: any = null

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabase as any)
        .from('certificates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (!error && data) updatedCert = data
    } catch (err) {
      console.warn('Supabase updateCertificate failed, saving locally:', err)
    }
  }

  const current = getStoredCertificates() || []
  const updatedList = current.map((c) => (c.id === id ? { ...c, ...updates } : c))
  saveStoredCertificates(updatedList as Certificate[])

  await queryClient.invalidateQueries({ queryKey: CERTIFICATES_KEY })
  return updatedCert || { id, ...updates }
}

export async function deleteCertificate(id: string) {
  if (isSupabaseConfigured()) {
    try {
      await (supabase as any).from('certificates').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase deleteCertificate failed:', err)
    }
  }

  const current = getStoredCertificates() || []
  saveStoredCertificates(current.filter((c) => c.id !== id))
  await queryClient.invalidateQueries({ queryKey: CERTIFICATES_KEY })
}

// --- MESSAGES ---
export async function markMessageRead(id: string, read: boolean) {
  if (isSupabaseConfigured()) {
    try {
      await (supabase as any).from('messages').update({ read }).eq('id', id)
    } catch (err) {
      console.warn('Supabase markMessageRead failed:', err)
    }
  }

  const current = getStoredMessages() || []
  const updated = current.map((m) => (m.id === id ? { ...m, read } : m))
  saveStoredMessages(updated)
  await queryClient.invalidateQueries({ queryKey: MESSAGES_KEY })
}

export async function deleteMessage(id: string) {
  if (isSupabaseConfigured()) {
    try {
      await (supabase as any).from('messages').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase deleteMessage failed:', err)
    }
  }

  const current = getStoredMessages() || []
  saveStoredMessages(current.filter((m) => m.id !== id))
  await queryClient.invalidateQueries({ queryKey: MESSAGES_KEY })
}
