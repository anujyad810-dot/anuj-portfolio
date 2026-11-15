import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ExternalLink, Github, ArrowUpRight, FolderGit2, Sparkles } from 'lucide-react'
import { SpotlightCard, DecryptedText } from '@/components/reactbits'
import { usePublicProjects } from '@/lib/queries'
import { Badge } from '@/components/ui/Badge'

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const { data: projects = [], isLoading } = usePublicProjects()

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Development' },
    { id: 'ml', label: 'AI & Machine Learning' },
    { id: 'design', label: 'UI/UX Design' },
    { id: 'other', label: 'Other' },
  ]

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'all') return true
    return p.category === activeCategory
  })

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
            <DecryptedText text="Featured Projects" speed={25} />
          </h1>
          <p className="text-sm sm:text-base text-muted mt-1.5 max-w-xl">
            A showcase of web applications, AI/ML pipelines, and design systems I've developed.
          </p>
        </div>

        {/* Clean Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-accent text-white font-semibold shadow-xs'
                  : 'bg-panel text-muted hover:text-text hover:bg-border/60 border border-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 rounded-2xl border border-border bg-panel animate-pulse p-6"
            />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-16 text-center text-muted space-y-3">
          <FolderGit2 className="h-10 w-10 text-muted mx-auto" />
          <p className="text-base font-medium text-text">No projects found in this category.</p>
          <p className="text-xs text-muted">
            Projects can be added or published dynamically through the Admin Portal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <SpotlightCard
              key={project.id}
              className="flex flex-col justify-between p-6 hover:border-accent/60 transition-all group rounded-2xl"
            >
              <div className="space-y-4">
                {/* Card Top: Category Badge & Featured Star */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/15 border border-accent/30 px-2.5 py-0.5 text-[11px] font-semibold text-accent uppercase">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.featured && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-400 font-medium"
                        title="Featured Project"
                      >
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span>Featured</span>
                      </span>
                    )}
                    {project.language && (
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {project.language}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Title & Short Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs sm:text-sm text-muted line-clamp-3 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>

                {/* Outcome Pill */}
                {project.outcome && (
                  <div className="rounded-lg bg-green/10 border border-green/20 px-3 py-1.5 text-xs text-green font-medium">
                    ✨ {project.outcome}
                  </div>
                )}

                {/* Tech Chips */}
                {project.tech && project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-bg px-2 py-0.5 text-[11px] text-muted border border-border/60 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Detail Link + External Links */}
              <div className="pt-5 mt-4 border-t border-border/40 flex items-center justify-between text-xs">
                <Link
                  to={`/projects/${project.slug}`}
                  className="font-semibold text-accent hover:underline flex items-center gap-1"
                >
                  <span>Case Study</span>
                  <span>→</span>
                </Link>

                <div className="flex items-center gap-3 text-muted">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-text transition-colors p-1"
                      title="GitHub Repository"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent transition-colors p-1"
                      title="Live Demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  )
}
