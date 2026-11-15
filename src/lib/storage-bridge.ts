import type {
  Settings,
  Project,
  SkillGroup,
  Skill,
  ProjectSkill,
  Experience,
  Education,
  Certificate,
  Message,
} from './database.types'

const SETTINGS_STORAGE_KEY = 'anuj_portfolio_settings'
const PROJECTS_STORAGE_KEY = 'anuj_portfolio_projects'
const SKILLS_STORAGE_KEY = 'anuj_portfolio_skills'
const GROUPS_STORAGE_KEY = 'anuj_portfolio_groups'
const EXPERIENCE_STORAGE_KEY = 'anuj_portfolio_experience'
const EDUCATION_STORAGE_KEY = 'anuj_portfolio_education'
const CERTIFICATES_STORAGE_KEY = 'anuj_portfolio_certificates'
const MESSAGES_STORAGE_KEY = 'anuj_portfolio_messages'
const MEDIA_STORAGE_KEY = 'anuj_portfolio_media'

// Helper to convert any File to a persistent Base64 Data URL
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

// -------------------------------------------------------------
// Settings Store
// -------------------------------------------------------------
export function getStoredSettings(): Settings | null {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Settings
  } catch {
    return null
  }
}

export function saveStoredSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (err) {
    console.warn('Failed to save settings to localStorage:', err)
  }
}

// -------------------------------------------------------------
// Projects Store
// -------------------------------------------------------------
export function getStoredProjects(): Project[] | null {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Project[]
  } catch {
    return null
  }
}

export function saveStoredProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects))
  } catch (err) {
    console.warn('Failed to save projects to localStorage:', err)
  }
}

// -------------------------------------------------------------
// Skills & Groups Store
// -------------------------------------------------------------
export function getStoredSkills(): Skill[] | null {
  try {
    const raw = localStorage.getItem(SKILLS_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Skill[]
  } catch {
    return null
  }
}

export function saveStoredSkills(skills: Skill[]): void {
  try {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills))
  } catch (err) {
    console.warn('Failed to save skills to localStorage:', err)
  }
}

export function getStoredSkillGroups(): SkillGroup[] | null {
  try {
    const raw = localStorage.getItem(GROUPS_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SkillGroup[]
  } catch {
    return null
  }
}

export function saveStoredSkillGroups(groups: SkillGroup[]): void {
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups))
  } catch (err) {
    console.warn('Failed to save skill groups to localStorage:', err)
  }
}

// -------------------------------------------------------------
// Experience Store
// -------------------------------------------------------------
export function getStoredExperience(): Experience[] | null {
  try {
    const raw = localStorage.getItem(EXPERIENCE_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Experience[]
  } catch {
    return null
  }
}

export function saveStoredExperience(experience: Experience[]): void {
  try {
    localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(experience))
  } catch (err) {
    console.warn('Failed to save experience to localStorage:', err)
  }
}

// -------------------------------------------------------------
// Education Store
// -------------------------------------------------------------
export function getStoredEducation(): Education[] | null {
  try {
    const raw = localStorage.getItem(EDUCATION_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Education[]
  } catch {
    return null
  }
}

export function saveStoredEducation(education: Education[]): void {
  try {
    localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify(education))
  } catch (err) {
    console.warn('Failed to save education to localStorage:', err)
  }
}

// -------------------------------------------------------------
// Certificates Store
// -------------------------------------------------------------
export function getStoredCertificates(): Certificate[] | null {
  try {
    const raw = localStorage.getItem(CERTIFICATES_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Certificate[]
  } catch {
    return null
  }
}

export function saveStoredCertificates(certificates: Certificate[]): void {
  try {
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(certificates))
  } catch (err) {
    console.warn('Failed to save certificates to localStorage:', err)
  }
}

// -------------------------------------------------------------
// Messages Store
// -------------------------------------------------------------
export function getStoredMessages(): Message[] | null {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Message[]
  } catch {
    return null
  }
}

export function saveStoredMessages(messages: Message[]): void {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages))
  } catch (err) {
    console.warn('Failed to save messages to localStorage:', err)
  }
}

// -------------------------------------------------------------
// Media Library Store
// -------------------------------------------------------------
export interface MediaItem {
  name: string
  url: string
  created_at: string
  size?: number
}

export function getStoredMedia(): MediaItem[] {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as MediaItem[]
  } catch {
    return []
  }
}

export function addStoredMedia(item: MediaItem): void {
  try {
    const list = getStoredMedia()
    list.unshift(item)
    // keep at most 50 items
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(list.slice(0, 50)))
  } catch (err) {
    console.warn('Failed to save media item to localStorage:', err)
  }
}

export function deleteStoredMedia(url: string): void {
  try {
    const list = getStoredMedia().filter((m) => m.url !== url)
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(list))
  } catch (err) {
    console.warn('Failed to delete media item from localStorage:', err)
  }
}
