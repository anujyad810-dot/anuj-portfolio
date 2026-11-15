export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
      }
      settings: {
        Row: {
          id: number
          name: string
          roles: string[]
          pitch: string
          about_md: string
          currently_learning: string[]
          interests: string[]
          availability_text: string
          location: string
          contact_email: string
          accent_color: string
          logo_url: string | null
          favicon_url: string | null
          avatar_url: string | null
          resume_url: string | null
          social_links: Json
          seo: Json
          sections_visibility: Json
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['settings']['Row']>
        Update: Partial<Database['public']['Tables']['settings']['Row']>
      }
      projects: {
        Row: {
          id: string
          slug: string
          title: string
          category: string
          language: string
          short_description: string
          outcome: string | null
          problem_md: string | null
          role_md: string | null
          features: string[]
          learned_md: string | null
          tech: string[]
          logo_url: string | null
          cover_url: string | null
          gallery: Json
          demo_url: string | null
          github_url: string | null
          video_url: string | null
          featured: boolean
          published: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      skill_groups: {
        Row: {
          id: string
          name: string
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['skill_groups']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['skill_groups']['Insert']>
      }
      skills: {
        Row: {
          id: string
          group_id: string
          name: string
          level: 'Learning' | 'Comfortable' | 'Strong'
          icon: string | null
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['skills']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['skills']['Insert']>
      }
      project_skills: {
        Row: {
          project_id: string
          skill_id: string
        }
        Insert: {
          project_id: string
          skill_id: string
        }
        Update: {
          project_id?: string
          skill_id?: string
        }
      }
      experience: {
        Row: {
          id: string
          title: string
          organisation: string
          start_date: string
          end_date: string | null
          description_md: string
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['experience']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['experience']['Insert']>
      }
      education: {
        Row: {
          id: string
          degree: string
          institute: string
          start_year: number
          end_year: number | null
          description: string | null
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['education']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['education']['Insert']>
      }
      certificates: {
        Row: {
          id: string
          title: string
          issuer: string
          issued_on: string
          image_url: string | null
          visible: boolean
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['certificates']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['certificates']['Insert']>
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at' | 'read'>
        Update: {
          read?: boolean
        }
      }
    }
  }
}

// Convenience export types
export type Settings = Database['public']['Tables']['settings']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type SkillGroup = Database['public']['Tables']['skill_groups']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type ProjectSkill = Database['public']['Tables']['project_skills']['Row']
export type Experience = Database['public']['Tables']['experience']['Row']
export type Education = Database['public']['Tables']['education']['Row']
export type Certificate = Database['public']['Tables']['certificates']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
