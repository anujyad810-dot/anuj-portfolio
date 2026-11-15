import React from 'react'
import { Link } from 'react-router-dom'
import {
  Download,
  Mail,
  ExternalLink,
  Github,
  MapPin,
  GraduationCap,
  Award,
  Layers,
  Calendar,
  Sparkles,
} from 'lucide-react'
import {
  useSettings,
  usePublicProjects,
  useSkillsWithGroups,
  useExperience,
  useEducation,
  useCertificates,
} from '@/lib/queries'
import { formatDate } from '@/lib/utils'

export function RecruiterView() {
  const { data: settings } = useSettings()
  const { data: projects = [] } = usePublicProjects()
  const { data: skillsData } = useSkillsWithGroups()
  const { data: experiences = [] } = useExperience()
  const { data: educationList = [] } = useEducation()
  const { data: certificates = [] } = useCertificates()

  const name = settings?.name || 'Anuj Yadav'
  const roles = settings?.roles?.join(' • ') || 'Full-Stack Developer • ML Enthusiast • Designer'
  const pitch = settings?.pitch || 'Building fast, clean, and intelligent web experiences.'

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-accent/30">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* 1. Header & Intro */}
        <header className="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-border/80 pb-10">
          {settings?.avatar_url ? (
            <img
              src={settings.avatar_url}
              alt={name}
              className="h-32 w-32 rounded-full border-2 border-accent object-cover shrink-0 shadow-lg"
            />
          ) : (
            <div className="h-28 w-28 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-3xl font-bold text-accent shrink-0 font-mono">
              {name.split(' ').map((n) => n[0]).join('')}
            </div>
          )}

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <div className="inline-block rounded-full bg-green/15 text-green text-xs font-mono font-semibold px-3 py-0.5 border border-green/30 mb-2">
                ● {settings?.availability_text || 'Open to internships'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
                {name}
              </h1>
              <p className="text-base font-semibold text-accent mt-1">{roles}</p>
            </div>

            <p className="text-sm text-muted leading-relaxed max-w-xl">{pitch}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-muted font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                <span>{settings?.location || 'Gwalior, India'}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-green" />
                <a href={`mailto:${settings?.contact_email}`} className="hover:underline">
                  {settings?.contact_email || 'anujyad810@gmail.com'}
                </a>
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
              {settings?.resume_url && (
                <a
                  href={settings.resume_url}
                  download="Anuj_Yadav_Resume.pdf"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-[#0d1117] hover:bg-accent/90 transition-colors shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume (PDF)</span>
                </a>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-panel px-4 py-2 text-xs font-semibold text-text hover:bg-border/60 transition-colors"
              >
                <Mail className="h-4 w-4 text-accent" />
                <span>Contact Directly</span>
              </Link>
            </div>
          </div>
        </header>

        {/* 2. Key Projects */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <Layers className="h-5 w-5 text-accent" />
              <span>Featured Projects</span>
            </h2>
            <Link to="/projects" className="text-xs font-mono text-accent hover:underline">
              View all ({projects.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-border bg-panel p-5 flex flex-col justify-between hover:border-accent/60 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-text">{p.title}</h3>
                    <span className="rounded bg-accent/15 px-2 py-0.5 text-[11px] font-mono text-accent uppercase">
                      {p.category}
                    </span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">{p.short_description}</p>

                  {p.outcome && (
                    <p className="text-xs font-semibold text-green font-mono">
                      ✨ {p.outcome}
                    </p>
                  )}

                  {p.tech && p.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 font-mono">
                      {p.tech.map((t, i) => (
                        <span
                          key={i}
                          className="rounded bg-bg border border-border/60 px-2 py-0.5 text-[10px] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono">
                  <Link to={`/projects/${p.slug}`} className="text-accent hover:underline font-semibold">
                    View Case Study →
                  </Link>
                  <div className="flex items-center gap-3">
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {p.demo_url && (
                      <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
                        <span>Live</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Technical Skills */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text border-b border-border/60 pb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green" />
            <span>Core Technical Skills</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {skillsData?.groups?.map((group) => {
              const groupSkills = skillsData.skills.filter((s) => s.group_id === group.id)
              return (
                <div key={group.id} className="rounded-lg border border-border bg-panel p-4 space-y-2">
                  <h3 className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                    {group.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {groupSkills.map((s) => (
                      <span
                        key={s.id}
                        className="rounded border border-border/60 bg-bg px-2 py-1 text-xs text-text"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. Leadership & Experience */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text border-b border-border/60 pb-2 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple" />
            <span>Leadership & Experience</span>
          </h2>

          <div className="space-y-4 font-mono">
            {experiences.map((exp) => (
              <div key={exp.id} className="rounded-lg border border-border bg-panel p-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-base text-text">{exp.title}</span>
                  <span className="text-muted">
                    {formatDate(exp.start_date)} — {formatDate(exp.end_date || 'present')}
                  </span>
                </div>
                <p className="text-xs font-semibold text-accent">@ {exp.organisation}</p>
                <p className="text-xs text-muted font-sans pt-1 leading-relaxed">
                  {exp.description_md}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Education & Credentials */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text border-b border-border/60 pb-2 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-accent" />
            <span>Education</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 font-mono">
            {educationList.map((edu) => (
              <div key={edu.id} className="rounded-lg border border-border bg-panel p-5 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-sm text-text">{edu.degree}</span>
                  <span className="text-muted">
                    {edu.start_year} — {edu.end_year || 'Present'}
                  </span>
                </div>
                <p className="text-xs text-accent font-semibold">{edu.institute}</p>
                {edu.description && (
                  <p className="text-xs text-muted font-sans pt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
