import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from './supabase'
import { queryClient } from './queryClient'
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
} from './storage-bridge'
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

// Fallback seed data in case Supabase is not yet set up
export const fallbackSettings: Settings = {
  id: 1,
  name: 'Anuj Yadav',
  roles: ['Full-Stack Developer', 'ML Enthusiast', 'UI/UX Designer'],
  pitch: 'Building fast, clean, and intelligent web experiences. Student at MITS Gwalior with a passion for software craftsmanship.',
  about_md: `## Hello! I'm Anuj Yadav 👋

I am a Computer Science & Design student at **Madhav Institute of Technology & Science (MITS), Gwalior** (2024–present).

### 🛠 What I Do
I specialize in full-stack web engineering, building responsive, accessible interfaces with modern frameworks, robust APIs, and scalable databases. I also conduct research in machine learning and deep learning, serving as **Technical Lead** at the **ML Research Club, MITS**.

### 💡 Beyond the Code
When I'm not writing code or experimenting with neural nets, I design digital assets and visual media with the **Graphics Team at MUN Club**, participate in hackathons, and contribute to open-source software.`,
  currently_learning: ['System Design', 'LLM Fine-tuning', 'Distributed Systems'],
  interests: ['Artificial Intelligence', 'Open Source', 'System Design', 'UI/UX Design', 'Competitive Programming'],
  availability_text: 'Open to internships',
  location: 'Gwalior, India',
  contact_email: 'anujyad810@gmail.com',
  accent_color: '#58a6ff',
  logo_url: null,
  favicon_url: null,
  avatar_url: null,
  resume_url: null,
  social_links: {
    github: 'https://github.com/anujyad810-dot',
    linkedin: 'https://linkedin.com/in/anuj-yadav-01748538a',
    twitter: 'https://x.com/anujyad810',
    instagram: 'https://instagram.com/anujyad810',
    email: 'anujyad810@gmail.com',
  },
  seo: {
    title: 'Anuj Yadav | Portfolio',
    description: 'Full-Stack Developer & ML Enthusiast',
  },
  sections_visibility: {
    projects: true,
    skills: true,
    experience: true,
    education: true,
    certificates: true,
  },
  updated_at: new Date().toISOString(),
}

export const fallbackProjects: Project[] = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    slug: 'devconnect',
    title: 'DevConnect — Developer Collaboration Platform',
    category: 'web',
    language: 'tsx',
    short_description: 'A full-stack collaborative social network where developers showcase open-source projects, discover peer code, and collaborate in real-time.',
    outcome: '60% increase in weekly peer discussions during university beta trial',
    problem_md: 'Developers often struggle to find technical peers with complementary skill sets for hackathons and open-source contributions.',
    role_md: 'Architected the end-to-end full stack application using React, Node.js, Express, and MongoDB. Implemented secure JWT authentication and real-time activity streams.',
    features: ['Live code snippet syntax highlighting', 'Real-time peer messaging', 'Project showcases with tech tagging', 'Dark/light UI with instant search'],
    learned_md: 'Mastered relational-like document modeling in MongoDB, WebSockets state management, and optimized client bundle sizes.',
    tech: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    logo_url: null,
    cover_url: null,
    gallery: [],
    demo_url: 'https://devconnect-preview.example.com',
    github_url: 'https://github.com/anujyad810-dot/devconnect',
    video_url: null,
    featured: true,
    published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    slug: 'ml-classifier',
    title: 'Neural Image Classifier & Vision Pipeline',
    category: 'ml',
    language: 'py',
    short_description: 'A deep convolutional neural network for multi-class image classification with data augmentation, transfer learning, and FastAPI inference.',
    outcome: 'Achieved 95.4% test accuracy with low latency CPU/GPU inferencing',
    problem_md: 'Real-time image classification pipelines often suffer from high inferencing latencies and poor generalization on unbalanced datasets.',
    role_md: 'Engineered the data augmentation pipeline in Python with Pandas and OpenCV. Trained and fine-tuned a CNN model using transfer learning, containerized with Docker.',
    features: ['Custom CNN layer architecture', 'Data augmentation pipeline', 'FastAPI REST inferencing endpoint', 'Docker containerized deployment'],
    learned_md: 'Gained deep understanding of convolutional filters, regularization methods to prevent overfitting, and production API serving.',
    tech: ['Python', 'TensorFlow', 'FastAPI', 'Pandas', 'Docker', 'OpenCV'],
    logo_url: null,
    cover_url: null,
    gallery: [],
    demo_url: 'https://ml-vision-demo.example.com',
    github_url: 'https://github.com/anujyad810-dot/ml-image-classifier',
    video_url: null,
    featured: true,
    published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '40000000-0000-0000-0000-000000000003',
    slug: 'portfolio-v1',
    title: 'Developer Portfolio v1',
    category: 'web',
    language: 'tsx',
    short_description: 'My original developer portfolio showcasing projects, interactive animations, and responsive layouts.',
    outcome: 'Hosted live at anuj-yad.netlify.app',
    problem_md: 'Needed a clean online presence to display academic achievements and software projects.',
    role_md: 'Designed and implemented frontend components with React, Tailwind CSS, and Netlify continuous deployment.',
    features: ['Responsive mobile-first layout', 'Dark theme support', 'Interactive project cards', 'Direct contact integration'],
    learned_md: 'Solidified foundations in modern CSS layout algorithms, React component lifecycles, and Netlify CI/CD.',
    tech: ['React', 'Tailwind CSS', 'JavaScript', 'Netlify'],
    logo_url: null,
    cover_url: null,
    gallery: [],
    demo_url: 'https://anuj-yad.netlify.app',
    github_url: 'https://github.com/anujyad810-dot/portfolio-v1',
    video_url: null,
    featured: false,
    published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const fallbackGroups: SkillGroup[] = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'frontend', sort_order: 1 },
  { id: '00000000-0000-0000-0000-000000000002', name: 'backend', sort_order: 2 },
  { id: '00000000-0000-0000-0000-000000000003', name: 'database', sort_order: 3 },
  { id: '00000000-0000-0000-0000-000000000004', name: 'ai_ml', sort_order: 4 },
  { id: '00000000-0000-0000-0000-000000000005', name: 'languages', sort_order: 5 },
  { id: '00000000-0000-0000-0000-000000000006', name: 'tools', sort_order: 6 },
]

export const fallbackSkills: Skill[] = [
  { id: '10000000-0000-0000-0000-000000000001', group_id: '00000000-0000-0000-0000-000000000001', name: 'React', level: 'Strong', icon: null, sort_order: 1 },
  { id: '10000000-0000-0000-0000-000000000002', group_id: '00000000-0000-0000-0000-000000000001', name: 'TypeScript', level: 'Comfortable', icon: null, sort_order: 2 },
  { id: '10000000-0000-0000-0000-000000000001', group_id: '00000000-0000-0000-0000-000000000001', name: 'Tailwind CSS', level: 'Strong', icon: null, sort_order: 3 },
  { id: '10000000-0000-0000-0000-000000000004', group_id: '00000000-0000-0000-0000-000000000001', name: 'Vite', level: 'Comfortable', icon: null, sort_order: 4 },
  { id: '10000000-0000-0000-0000-000000000005', group_id: '00000000-0000-0000-0000-000000000002', name: 'Node.js', level: 'Strong', icon: null, sort_order: 1 },
  { id: '10000000-0000-0000-0000-000000000006', group_id: '00000000-0000-0000-0000-000000000002', name: 'Express', level: 'Strong', icon: null, sort_order: 2 },
  { id: '10000000-0000-0000-0000-000000000007', group_id: '00000000-0000-0000-0000-000000000002', name: 'Django', level: 'Comfortable', icon: null, sort_order: 3 },
  { id: '10000000-0000-0000-0000-000000000008', group_id: '00000000-0000-0000-0000-000000000003', name: 'MongoDB', level: 'Strong', icon: null, sort_order: 1 },
  { id: '10000000-0000-0000-0000-000000000009', group_id: '00000000-0000-0000-0000-000000000003', name: 'MySQL', level: 'Comfortable', icon: null, sort_order: 2 },
  { id: '10000000-0000-0000-0000-000000000010', group_id: '00000000-0000-0000-0000-000000000003', name: 'PostgreSQL', level: 'Comfortable', icon: null, sort_order: 3 },
  { id: '10000000-0000-0000-0000-000000000011', group_id: '00000000-0000-0000-0000-000000000004', name: 'Scikit-Learn', level: 'Comfortable', icon: null, sort_order: 1 },
  { id: '10000000-0000-0000-0000-000000000012', group_id: '00000000-0000-0000-0000-000000000004', name: 'TensorFlow', level: 'Learning', icon: null, sort_order: 2 },
  { id: '10000000-0000-0000-0000-000000000013', group_id: '00000000-0000-0000-0000-000000000004', name: 'Pandas', level: 'Strong', icon: null, sort_order: 3 },
  { id: '10000000-0000-0000-0000-000000000014', group_id: '00000000-0000-0000-0000-000000000005', name: 'Python', level: 'Strong', icon: null, sort_order: 1 },
  { id: '10000000-0000-0000-0000-000000000015', group_id: '00000000-0000-0000-0000-000000000005', name: 'C++ (DSA)', level: 'Comfortable', icon: null, sort_order: 2 },
  { id: '10000000-0000-0000-0000-000000000016', group_id: '00000000-0000-0000-0000-000000000005', name: 'JavaScript', level: 'Strong', icon: null, sort_order: 3 },
  { id: '10000000-0000-0000-0000-000000000017', group_id: '00000000-0000-0000-0000-000000000006', name: 'Git & GitHub', level: 'Strong', icon: null, sort_order: 1 },
  { id: '10000000-0000-0000-0000-000000000018', group_id: '00000000-0000-0000-0000-000000000006', name: 'Docker', level: 'Learning', icon: null, sort_order: 2 },
  { id: '10000000-0000-0000-0000-000000000019', group_id: '00000000-0000-0000-0000-000000000006', name: 'Figma', level: 'Comfortable', icon: null, sort_order: 3 },
]

export const fallbackExperience: Experience[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    title: 'Technical Lead',
    organisation: 'ML Research Club, MITS',
    start_date: '2024-08',
    end_date: 'present',
    description_md: 'Leading hands-on research and technical projects across machine learning and neural architectures.\n- Organizing interactive workshops on computer vision and predictive modeling for 100+ university students.\n- Mentoring junior peers in data science libraries, model evaluation, and competitive Kaggle challenges.',
    sort_order: 1,
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    title: 'Graphics Team Lead',
    organisation: 'MUN Club, MITS',
    start_date: '2024-08',
    end_date: 'present',
    description_md: 'Directing visual identity and branding for flagship Model United Nations delegations.\n- Designed branding kits, promotional posters, stage banners, and digital collateral viewed by over 500 delegates.\n- Coordinated with public relations to maintain consistent typography and visual appeal across social channels.',
    sort_order: 2,
  },
]

export const fallbackEducation: Education[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    degree: 'B.Tech in Computer Science & Design',
    institute: 'Madhav Institute of Technology & Science (MITS), Gwalior',
    start_year: 2024,
    end_year: 2028,
    description: 'Focusing on foundational software engineering, algorithms & data structures in C++, full-stack web systems, neural networks, and modern UI/UX design heuristics.',
    sort_order: 1,
  },
]

export const fallbackCertificates: Certificate[] = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    title: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI / Coursera',
    issued_on: '2024-09',
    image_url: null,
    visible: true,
    sort_order: 1,
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    title: 'Data Structures & Algorithms in C++',
    issuer: 'Coding Ninjas',
    issued_on: '2024-07',
    image_url: null,
    visible: true,
    sort_order: 2,
  },
]

// Query Keys
export const SETTINGS_KEY = ['settings']
export const PROJECTS_KEY = ['projects']
export const SKILLS_KEY = ['skills']
export const EXPERIENCE_KEY = ['experience']
export const EDUCATION_KEY = ['education']
export const CERTIFICATES_KEY = ['certificates']
export const MESSAGES_KEY = ['messages']

// ----------------------------------------------------------------
// Settings
// ----------------------------------------------------------------
export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: async () => {
      const stored = getStoredSettings()
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.from('settings').select('*').single()
          if (!error && data) {
            saveStoredSettings(data as Settings)
            return data as Settings
          }
        } catch (err) {
          console.warn('Supabase fetch settings failed, using stored/fallback:', err)
        }
      }
      return stored || fallbackSettings
    },
  })
}

// ----------------------------------------------------------------
// Projects
// ----------------------------------------------------------------
export function usePublicProjects(category?: string) {
  return useQuery({
    queryKey: [...PROJECTS_KEY, 'public', category],
    queryFn: async () => {
      const stored = getStoredProjects()

      if (isSupabaseConfigured()) {
        try {
          let query = supabase
            .from('projects')
            .select('*')
            .order('featured', { ascending: false })
            .order('sort_order', { ascending: true })

          if (category && category !== 'all') {
            query = query.eq('category', category)
          }

          const { data, error } = await query
          if (!error && data && data.length > 0) {
            saveStoredProjects(data as Project[])
            return data as Project[]
          }
        } catch (err) {
          console.warn('Supabase fetch projects failed, using stored/fallback:', err)
        }
      }

      const list = stored && stored.length > 0 ? stored : fallbackProjects
      if (category && category !== 'all') {
        return list.filter((p) => p.category === category)
      }
      return list
    },
  })
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: [...PROJECTS_KEY, slug],
    queryFn: async () => {
      const stored = getStoredProjects()

      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('slug', slug)
            .single()

          if (!error && data) return data as Project
        } catch {}
      }

      const list = stored && stored.length > 0 ? stored : fallbackProjects
      const found = list.find((p) => p.slug === slug)
      if (found) return found
      throw new Error('Project not found')
    },
    enabled: !!slug,
  })
}

// ----------------------------------------------------------------
// Skills with groups
// ----------------------------------------------------------------
export function useSkillsWithGroups() {
  return useQuery({
    queryKey: SKILLS_KEY,
    queryFn: async () => {
      const storedSkills = getStoredSkills()
      const storedGroups = getStoredSkillGroups()

      if (isSupabaseConfigured()) {
        try {
          const [groupsRes, skillsRes, projectSkillsRes] = await Promise.all([
            supabase.from('skill_groups').select('*').order('sort_order'),
            supabase.from('skills').select('*').order('sort_order'),
            supabase.from('project_skills').select('*'),
          ])

          if (!groupsRes.error && groupsRes.data && groupsRes.data.length > 0) {
            saveStoredSkillGroups(groupsRes.data as SkillGroup[])
            if (skillsRes.data) saveStoredSkills(skillsRes.data as Skill[])

            return {
              groups: groupsRes.data as SkillGroup[],
              skills: (skillsRes.data || []) as Skill[],
              projectSkills: (projectSkillsRes.data || []) as ProjectSkill[],
            }
          }
        } catch (err) {
          console.warn('Supabase fetch skills failed, using stored/fallback:', err)
        }
      }

      return {
        groups: storedGroups && storedGroups.length > 0 ? storedGroups : fallbackGroups,
        skills: storedSkills && storedSkills.length > 0 ? storedSkills : fallbackSkills,
        projectSkills: [],
      }
    },
  })
}

// ----------------------------------------------------------------
// Experience
// ----------------------------------------------------------------
export function useExperience() {
  return useQuery({
    queryKey: EXPERIENCE_KEY,
    queryFn: async () => {
      const stored = getStoredExperience()

      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('experience')
            .select('*')
            .order('sort_order', { ascending: true })

          if (!error && data && data.length > 0) {
            saveStoredExperience(data as Experience[])
            return data as Experience[]
          }
        } catch (err) {
          console.warn('Supabase fetch experience failed, using stored/fallback:', err)
        }
      }

      return stored && stored.length > 0 ? stored : fallbackExperience
    },
  })
}

// ----------------------------------------------------------------
// Education
// ----------------------------------------------------------------
export function useEducation() {
  return useQuery({
    queryKey: EDUCATION_KEY,
    queryFn: async () => {
      const stored = getStoredEducation()

      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('education')
            .select('*')
            .order('sort_order', { ascending: true })

          if (!error && data && data.length > 0) {
            saveStoredEducation(data as Education[])
            return data as Education[]
          }
        } catch (err) {
          console.warn('Supabase fetch education failed, using stored/fallback:', err)
        }
      }

      return stored && stored.length > 0 ? stored : fallbackEducation
    },
  })
}

// ----------------------------------------------------------------
// Certificates
// ----------------------------------------------------------------
export function useCertificates() {
  return useQuery({
    queryKey: CERTIFICATES_KEY,
    queryFn: async () => {
      const stored = getStoredCertificates()

      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('visible', true)
            .order('sort_order', { ascending: true })

          if (!error && data && data.length > 0) {
            saveStoredCertificates(data as Certificate[])
            return data as Certificate[]
          }
        } catch (err) {
          console.warn('Supabase fetch certificates failed, using stored/fallback:', err)
        }
      }

      return stored && stored.length > 0 ? stored : fallbackCertificates
    },
  })
}

// ----------------------------------------------------------------
// Messages (Admin Inbox)
// ----------------------------------------------------------------
export function useMessages() {
  return useQuery({
    queryKey: MESSAGES_KEY,
    queryFn: async () => {
      const stored = getStoredMessages()

      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })

          if (!error && data) {
            saveStoredMessages(data as Message[])
            return data as Message[]
          }
        } catch (err) {
          console.warn('Supabase fetch messages failed:', err)
        }
      }

      return stored || []
    },
  })
}

// ----------------------------------------------------------------
// Send message (Contact Form Dispatch)
// ----------------------------------------------------------------
interface SendMessagePayload {
  name: string
  email: string
  message: string
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const newMsg: Message = {
        id: crypto.randomUUID(),
        name: payload.name,
        email: payload.email,
        message: payload.message,
        read: false,
        created_at: new Date().toISOString(),
      }

      if (isSupabaseConfigured()) {
        try {
          const { error } = await (supabase as any).from('messages').insert({
            name: payload.name,
            email: payload.email,
            message: payload.message,
          })
          if (error) console.warn('Supabase message insert error:', error)
        } catch (err) {
          console.warn('Supabase message insert failed, saved locally:', err)
        }
      }

      const current = getStoredMessages() || []
      saveStoredMessages([newMsg, ...current])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_KEY })
    },
  })
}
