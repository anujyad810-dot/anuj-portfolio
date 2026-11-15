import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export function getSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('anuj_custom_supabase_url')
    if (custom && custom.trim()) return custom.trim()
  }
  return ((import.meta.env.VITE_SUPABASE_URL as string) || '').trim()
}

export function getSupabaseAnonKey(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('anuj_custom_supabase_anon_key')
    if (custom && custom.trim()) return custom.trim()
  }
  return ((import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '').trim()
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  return (
    !!url &&
    !url.includes('placeholder') &&
    url.startsWith('https://') &&
    !!key &&
    !key.includes('placeholder')
  )
}

export function setCustomSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem('anuj_custom_supabase_url', url.trim())
    } else {
      localStorage.removeItem('anuj_custom_supabase_url')
    }

    if (anonKey && anonKey.trim()) {
      localStorage.setItem('anuj_custom_supabase_anon_key', anonKey.trim())
    } else {
      localStorage.removeItem('anuj_custom_supabase_anon_key')
    }
  }
}

const activeUrl = getSupabaseUrl() || 'https://placeholder.supabase.co'
const activeKey = getSupabaseAnonKey() || 'placeholder'

export const supabase = createClient<Database>(activeUrl, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
