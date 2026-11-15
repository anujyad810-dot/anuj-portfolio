import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-border bg-panel p-8 sm:p-10 text-center space-y-6 shadow-xl">
        <div className="h-16 w-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto text-accent text-2xl font-black font-mono">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text">Page Not Found</h1>
          <p className="text-sm text-muted leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md">
              <Home className="h-4 w-4 mr-2" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="secondary" size="md">
              <span>View Projects</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
