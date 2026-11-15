import React from 'react'
import { Link } from 'react-router-dom'
import {
  FolderGit2,
  Inbox,
  Award,
  PlusCircle,
  FileText,
  ExternalLink,
  Cpu,
  Mail,
  ArrowRight,
} from 'lucide-react'
import { usePublicProjects, useMessages, useCertificates, useSkillsWithGroups } from '@/lib/queries'
import { CountUp } from '@/components/reactbits'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

export default function AdminDashboard() {
  const { data: projects = [] } = usePublicProjects()
  const { data: messages = [] } = useMessages()
  const { data: certificates = [] } = useCertificates()
  const { data: skillsData } = useSkillsWithGroups()

  const unreadMessages = messages.filter((m) => !m.read)
  const recentMessages = messages.slice(0, 4)

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-mono">
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">Overview Dashboard</h1>
          <p className="text-xs text-muted font-sans mt-1">
            Real-time management overview of your portfolio content, incoming messages, and assets.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/projects">
            <Button variant="primary" size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              <span>Add Project</span>
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button variant="secondary" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              <span>Upload Resume</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-xl border border-border bg-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-muted text-xs uppercase tracking-wider">
            <span>Published Projects</span>
            <FolderGit2 className="h-4 w-4 text-accent" />
          </div>
          <div className="text-3xl font-bold text-text">
            <CountUp to={projects.length} duration={1} />
          </div>
          <Link to="/admin/projects" className="text-xs text-accent hover:underline block pt-1">
            Manage projects →
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-muted text-xs uppercase tracking-wider">
            <span>Unread Messages</span>
            <Inbox className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-text">
            <CountUp to={unreadMessages.length} duration={1} />
          </div>
          <Link to="/admin/messages" className="text-xs text-yellow-400 hover:underline block pt-1">
            Open inbox →
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-muted text-xs uppercase tracking-wider">
            <span>Total Skills</span>
            <Cpu className="h-4 w-4 text-green" />
          </div>
          <div className="text-3xl font-bold text-text">
            <CountUp to={skillsData?.skills?.length || 0} duration={1} />
          </div>
          <Link to="/admin/skills" className="text-xs text-green hover:underline block pt-1">
            Edit skills matrix →
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-muted text-xs uppercase tracking-wider">
            <span>Certificates</span>
            <Award className="h-4 w-4 text-purple" />
          </div>
          <div className="text-3xl font-bold text-text">
            <CountUp to={certificates.length} duration={1} />
          </div>
          <Link to="/admin/education" className="text-xs text-purple hover:underline block pt-1">
            View credentials →
          </Link>
        </div>
      </div>

      {/* Main split: Recent Messages & Quick Help */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-panel p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              <span>Recent Inquiries & Messages</span>
            </h2>
            <Link to="/admin/messages" className="text-xs text-accent hover:underline">
              View all ({messages.length}) →
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              No incoming messages yet. The contact form on the public site stores entries here.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-lg border p-4 transition-colors ${
                    !msg.read ? 'border-accent/40 bg-accent/5' : 'border-border bg-bg'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-text">{msg.name}</span>
                    <span className="text-[11px] text-muted">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-accent mt-0.5">{msg.email}</p>
                  <p className="text-xs text-muted mt-2 font-sans line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips & Workflow */}
        <div className="rounded-xl border border-border bg-panel p-6 space-y-4">
          <h2 className="text-base font-bold text-text border-b border-border/60 pb-3">
            Publishing Workflow
          </h2>

          <div className="space-y-3 text-xs text-muted font-sans leading-relaxed">
            <p>
              <strong className="text-text font-mono">1. Instant Updates:</strong> Any change you save in these admin modules updates the live portfolio immediately.
            </p>
            <p>
              <strong className="text-text font-mono">2. Draft State:</strong> Projects with Published toggle turned OFF will only be visible to you while drafting.
            </p>
            <p>
              <strong className="text-text font-mono">3. Terminal & Explorer:</strong> New projects automatically appear as openable files in the VS Code terminal and file tree.
            </p>
          </div>

          <div className="pt-2 border-t border-border/60">
            <Link to="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <span>Open Public Portfolio</span>
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
