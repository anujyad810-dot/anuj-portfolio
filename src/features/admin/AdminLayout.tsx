import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  GitCommit,
  GraduationCap,
  Settings,
  Image,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMessages } from '@/lib/queries'
import { ToastProvider } from '@/components/ui/Toast'

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { data: messages = [] } = useMessages()

  const unreadMessagesCount = messages.filter((m) => !m.read).length

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Skills & Tech', path: '/admin/skills', icon: Cpu },
    { label: 'Experience Log', path: '/admin/experience', icon: GitCommit },
    { label: 'Education & Certs', path: '/admin/education', icon: GraduationCap },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
    { label: 'Media Library', path: '/admin/media', icon: Image },
    { label: 'Messages', path: '/admin/messages', icon: Inbox, badge: unreadMessagesCount },
  ]

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <ToastProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-bg text-text font-mono">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 h-full flex-col border-r border-border bg-panel select-none shrink-0">
          {/* Brand */}
          <div className="h-14 border-b border-border/80 px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-text">Admin Portal</span>
                <span className="block text-[10px] text-muted">CMS Control Center</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-accent/15 text-accent font-bold'
                      : 'text-muted hover:bg-border/40 hover:text-text'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-accent text-white font-bold px-1.5 py-0.2 text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User info & Logout */}
          <div className="p-3 border-t border-border/60 space-y-2">
            <div className="px-3 py-1.5 text-[11px] text-muted truncate">
              Signed in as: <span className="text-text font-semibold">{user?.email || 'Admin'}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header & Drawer */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-panel border-b border-border z-40 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            <span className="font-bold text-sm">Admin Portal</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-muted hover:text-text rounded"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-bg pt-16 p-4 flex flex-col justify-between">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-text hover:bg-panel"
                  >
                    <Icon className="h-5 w-5 text-accent" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg p-4 text-sm text-red-400 font-semibold"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 md:pt-0">
          {/* Top Bar */}
          <header className="h-14 border-b border-border bg-panel/50 backdrop-blur-sm px-6 flex items-center justify-between select-none shrink-0">
            <div className="text-xs text-muted">
              Live Updates Mode: <span className="text-green font-semibold">Instant Cache Invalidation</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-border bg-panel px-3 py-1.5 text-xs text-text hover:text-accent hover:border-accent transition-colors"
              >
                <span>View Live Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </header>

          {/* Page Outlet */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 select-text">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
export default AdminLayout
