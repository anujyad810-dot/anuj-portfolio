import { useState, useEffect, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  isAdmin: boolean
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAdmin: false,
    loading: true,
  })

  const checkAdmin = useCallback(async (userId: string): Promise<boolean> => {
    // Check if demo dev admin mode is enabled
    if (localStorage.getItem('demo_admin_active') === 'true') {
      return true
    }
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single()
      if (error) return false
      return !!data
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    // Check local demo admin mode
    if (localStorage.getItem('demo_admin_active') === 'true') {
      setState({
        user: { id: 'demo-admin', email: 'anuj@portfolio.admin' } as any,
        session: null,
        isAdmin: true,
        loading: false,
      })
      return
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const isAdmin = await checkAdmin(session.user.id)
        setState({ user: session.user, session, isAdmin, loading: false })
      } else {
        setState({ user: null, session: null, isAdmin: false, loading: false })
      }
    })

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const isAdmin = await checkAdmin(session.user.id)
        setState({ user: session.user, session, isAdmin, loading: false })
      } else {
        setState({ user: null, session: null, isAdmin: false, loading: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [checkAdmin])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    localStorage.removeItem('demo_admin_active')
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.warn('Sign out:', e)
    }
    setState({ user: null, session: null, isAdmin: false, loading: false })
  }, [])

  return {
    user: state.user,
    session: state.session,
    isAdmin: state.isAdmin,
    loading: state.loading,
    signIn,
    signOut,
  }
}
