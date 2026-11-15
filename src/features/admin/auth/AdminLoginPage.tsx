import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, ArrowLeft, AlertCircle, Shield, CheckCircle } from 'lucide-react'
import { loginSchema, LoginFormData } from '@/lib/schemas'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function AdminLoginPage() {
  const [authError, setAuthError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const { signIn, user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // If already logged in, redirect
  React.useEffect(() => {
    if (user || isAdmin) {
      navigate('/admin')
    }
  }, [user, isAdmin, navigate])

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null)
    try {
      await signIn(data.email, data.password)
      navigate('/admin')
    } catch (err: any) {
      console.error('Login error:', err)
      setAuthError(err.message || 'Invalid email or password.')
    }
  }

  // Demo bypass for local testing if needed
  const handleDemoAccess = () => {
    localStorage.setItem('demo_admin_active', 'true')
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 font-mono text-text">
      <div className="max-w-md w-full rounded-xl border border-border bg-panel p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-text">Portfolio Admin Portal</h1>
          <p className="text-xs text-muted font-sans">
            Authentication restricted to authorized administrator.
          </p>
        </div>

        {authError && (
          <div className="rounded-md bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {resetSent && (
          <div className="rounded-md bg-green/10 border border-green/30 p-3 text-xs text-green flex items-start gap-2">
            <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Password reset instructions dispatched if email exists.</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Master Password"
            type="password"
            placeholder="••••••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            className="w-full text-xs"
          >
            Authenticate & Open Dashboard
          </Button>
        </form>

        <div className="pt-2 border-t border-border/60 flex flex-col gap-3 text-center text-xs text-muted">
          <button
            type="button"
            onClick={handleDemoAccess}
            className="text-accent hover:underline text-[11px] font-semibold"
          >
            [Dev Mode: Instant Preview as Admin]
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 text-muted hover:text-text text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
