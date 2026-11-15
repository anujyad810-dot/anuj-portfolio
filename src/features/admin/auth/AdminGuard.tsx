import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg font-mono">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-muted">Authenticating admin session...</p>
        </div>
      </div>
    )
  }

  // If Supabase credentials are placeholder or not logged in, redirect to login
  if (!user && !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
export default AdminGuard
