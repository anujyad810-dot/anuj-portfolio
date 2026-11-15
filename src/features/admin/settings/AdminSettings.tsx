import React, { useState, useEffect } from 'react'
import {
  Settings,
  User,
  Palette,
  Share2,
  FileText,
  Save,
  Check,
  Database,
  Cloud,
  HardDrive,
  Key,
  Globe,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { useSettings } from '@/lib/queries'
import { updateSettings } from '../lib/mutations'
import { getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured, setCustomSupabaseConfig } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TagInput } from '@/components/ui/TagInput'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { FileUpload } from '@/components/ui/FileUpload'
import { useToast } from '@/components/ui/Toast'

export default function AdminSettings() {
  const { toast } = useToast()
  const { data: settings, isLoading } = useSettings()

  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'social' | 'resume' | 'database'>('general')
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [pitch, setPitch] = useState('')
  const [aboutMd, setAboutMd] = useState('')
  const [currentlyLearning, setCurrentlyLearning] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [availabilityText, setAvailabilityText] = useState('')
  const [location, setLocation] = useState('')
  const [contactEmail, setContactEmail] = useState('')

  // Appearance
  const [accentColor, setAccentColor] = useState('#58a6ff')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')

  // Socials
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')

  // Database / Supabase configuration
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('')
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('')
  const [supabaseConnected, setSupabaseConnected] = useState(false)

  useEffect(() => {
    if (settings) {
      setName(settings.name || '')
      setRoles(settings.roles || [])
      setPitch(settings.pitch || '')
      setAboutMd(settings.about_md || '')
      setCurrentlyLearning(settings.currently_learning || [])
      setInterests(settings.interests || [])
      setAvailabilityText(settings.availability_text || '')
      setLocation(settings.location || '')
      setContactEmail(settings.contact_email || '')
      setAccentColor(settings.accent_color || '#58a6ff')
      setAvatarUrl(settings.avatar_url || '')
      setLogoUrl(settings.logo_url || '')
      setResumeUrl(settings.resume_url || '')

      const socials: any = settings.social_links || {}
      setGithubUrl(socials.github || '')
      setLinkedinUrl(socials.linkedin || '')
      setTwitterUrl(socials.twitter || '')
      setInstagramUrl(socials.instagram || '')
    }

    // Load active Supabase config
    setSupabaseUrlInput(getSupabaseUrl())
    setSupabaseKeyInput(getSupabaseAnonKey())
    setSupabaseConnected(isSupabaseConfigured())
  }, [settings])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await updateSettings({
        name,
        roles,
        pitch,
        about_md: aboutMd,
        currently_learning: currentlyLearning,
        interests,
        availability_text: availabilityText,
        location,
        contact_email: contactEmail,
        accent_color: accentColor,
        avatar_url: avatarUrl || null,
        logo_url: logoUrl || null,
        resume_url: resumeUrl || null,
        social_links: {
          github: githubUrl,
          linkedin: linkedinUrl,
          twitter: twitterUrl,
          instagram: instagramUrl,
          email: contactEmail,
        },
      })

      // Update CSS accent color dynamically on root
      document.documentElement.style.setProperty('--color-accent', accentColor)

      toast({
        title: 'Settings Saved',
        description: 'All configurations, text, and media saved successfully.',
        type: 'success',
      })
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message || 'Error updating settings.',
        type: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveDatabaseConfig = () => {
    setCustomSupabaseConfig(supabaseUrlInput, supabaseKeyInput)
    const isNowConnected = isSupabaseConfigured()
    setSupabaseConnected(isNowConnected)

    toast({
      title: isNowConnected ? 'Supabase Connected!' : 'Local Mode Configured',
      description: isNowConnected
        ? 'Your project is now linked to your Supabase PostgreSQL & Storage.'
        : 'Running in resilient local persistent storage mode.',
      type: 'success',
    })
  }

  const tabs = [
    { id: 'general', label: 'Bio & Overview', icon: User },
    { id: 'appearance', label: 'Appearance & Media', icon: Palette },
    { id: 'resume', label: 'Resume Document', icon: FileText },
    { id: 'social', label: 'Social Channels', icon: Share2 },
    { id: 'database', label: 'Backend & Supabase', icon: Database },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Global Site Settings</h1>
          <p className="text-xs text-muted font-sans mt-0.5">
            Update personal info, roles, hero text, resume PDF, appearance options, and cloud backend.
          </p>
        </div>

        <Button type="button" variant="primary" size="sm" onClick={handleSave} loading={submitting}>
          <Save className="h-4 w-4 mr-1" />
          <span>Save Changes</span>
        </Button>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap gap-1 border-b border-border pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-t border-l border-r ${
                isActive
                  ? 'bg-panel border-border text-accent -mb-px'
                  : 'bg-transparent border-transparent text-muted hover:text-text hover:bg-panel/40'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSave} className="rounded-xl border border-border bg-panel p-6 space-y-6">
        {/* Tab 1: General Info */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anuj Yadav"
              />
              <Input
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gwalior, India"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. anujyad810@gmail.com"
              />
              <Input
                label="Availability Status"
                value={availabilityText}
                onChange={(e) => setAvailabilityText(e.target.value)}
                placeholder="e.g. Open to internships"
              />
            </div>

            <TagInput
              label="Rotating Roles (Displayed in hero typing animation)"
              tags={roles}
              onChange={setRoles}
              placeholder="Add role (e.g. Full-Stack Developer) and press Enter"
            />

            <Input
              label="One-line Pitch"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="e.g. Building fast, clean, and intelligent web experiences."
            />

            <MarkdownEditor
              label="Biography / About Markdown (about.md)"
              value={aboutMd}
              onChange={setAboutMd}
              rows={8}
            />

            <TagInput
              label="Currently Exploring / Learning"
              tags={currentlyLearning}
              onChange={setCurrentlyLearning}
              placeholder="e.g. System Design, LLM Fine-tuning"
            />

            <TagInput
              label="Interests & Hobbies"
              tags={interests}
              onChange={setInterests}
              placeholder="e.g. Artificial Intelligence, Open Source"
            />
          </div>
        )}

        {/* Tab 2: Appearance & Media */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-muted uppercase tracking-wider">
                Accent Brand Color (Applied across buttons, badges, highlights)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-9 w-12 rounded cursor-pointer border border-border bg-transparent p-0.5"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#58a6ff"
                  className="w-32"
                />
                <div className="flex gap-2">
                  {['#58a6ff', '#3fb950', '#bc8cff', '#d29922', '#f85149'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAccentColor(c)}
                      className="h-6 w-6 rounded-full border border-border hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <ImageUpload
                label="Profile Avatar (About page & Hero)"
                value={avatarUrl}
                onChange={setAvatarUrl}
                folder="avatars"
              />
              <ImageUpload
                label="Site Brand Logo / Monogram"
                value={logoUrl}
                onChange={setLogoUrl}
                folder="branding"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Resume PDF Document */}
        {activeTab === 'resume' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-accent/30 bg-accent/10 text-xs text-text space-y-1">
              <p className="font-bold text-accent">PDF Resume Management</p>
              <p className="text-muted leading-relaxed">
                Upload your latest resume document in PDF format. It will be immediately available
                for visitors to view in the built-in PDF viewer and download via the Download Resume buttons.
              </p>
            </div>

            <FileUpload
              label="Upload Resume Document (PDF)"
              value={resumeUrl}
              onChange={setResumeUrl}
              bucket="resume"
              folder="docs"
              accept=".pdf,application/pdf"
            />
          </div>
        )}

        {/* Tab 4: Social Channels */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <Input
              label="GitHub Profile URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/anujyad810-dot"
            />
            <Input
              label="LinkedIn Profile URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/anuj-yadav-01748538a"
            />
            <Input
              label="X / Twitter URL"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://x.com/anujyad810"
            />
            <Input
              label="Instagram URL"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/anujyad810"
            />
          </div>
        )}

        {/* Tab 5: Backend & Supabase Cloud Connection */}
        {activeTab === 'database' && (
          <div className="space-y-6 font-sans">
            {/* Status Card */}
            <div className="rounded-xl border border-border bg-bg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {supabaseConnected ? (
                  <div className="h-10 w-10 rounded-full bg-green/15 border border-green/30 flex items-center justify-center text-green">
                    <Cloud className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                    <HardDrive className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-text text-sm flex items-center gap-2">
                    <span>
                      {supabaseConnected
                        ? 'Connected to Cloud Supabase'
                        : 'Local Persistent Storage Mode Active'}
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        supabaseConnected ? 'bg-green animate-pulse' : 'bg-accent'
                      }`}
                    />
                  </h4>
                  <p className="text-xs text-muted font-sans mt-0.5">
                    {supabaseConnected
                      ? 'Live database sync and cloud bucket storage are active.'
                      : 'All changes, projects, and uploads are saved locally in persistent browser storage without fetch errors.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    supabaseConnected
                      ? 'bg-green/15 text-green border border-green/30'
                      : 'bg-accent/15 text-accent border border-accent/30'
                  }`}
                >
                  {supabaseConnected ? 'Cloud Active' : 'Offline / Local Ready'}
                </span>
              </div>
            </div>

            {/* Supabase Inputs */}
            <div className="space-y-4 font-mono">
              <Input
                label="Supabase Project URL"
                value={supabaseUrlInput}
                onChange={(e) => setSupabaseUrlInput(e.target.value)}
                placeholder="https://your-project-ref.supabase.co"
              />

              <Input
                label="Supabase Anon / Public API Key"
                value={supabaseKeyInput}
                onChange={(e) => setSupabaseKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              />

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted font-sans">
                  Paste credentials here or in <code>.env.local</code>.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveDatabaseConfig}
                >
                  <span>Connect & Save Backend</span>
                </Button>
              </div>
            </div>

            {/* Quick 3-Step Setup Instructions */}
            <div className="rounded-xl border border-border/80 bg-panel/60 p-5 space-y-3 font-sans text-xs">
              <h4 className="font-bold text-text text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green" />
                <span>How to link your free Supabase cloud database:</span>
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-muted leading-relaxed">
                <li>
                  Create a free project at{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline font-semibold"
                  >
                    supabase.com
                  </a>
                  .
                </li>
                <li>
                  Open the <strong>SQL Editor</strong> in your Supabase dashboard and run the 4 files
                  inside your project's <code>supabase/</code> folder:{' '}
                  <span className="font-mono text-text">schema.sql</span>,{' '}
                  <span className="font-mono text-text">storage.sql</span>,{' '}
                  <span className="font-mono text-text">policies.sql</span>, and{' '}
                  <span className="font-mono text-text">seed.sql</span>.
                </li>
                <li>
                  Copy your <strong>Project URL</strong> and <strong>Anon Key</strong> from Project
                  Settings &gt; API, paste them above, and click <em>Connect & Save Backend</em>!
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Save Footer for general/appearance/resume/social tabs */}
        {activeTab !== 'database' && (
          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" variant="primary" size="md" loading={submitting}>
              <Save className="h-4 w-4 mr-1" />
              <span>Save Settings</span>
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
