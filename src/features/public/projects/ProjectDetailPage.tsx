import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ExternalLink,
  Github,
  Play,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useProject } from '@/lib/queries'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DecryptedText } from '@/components/reactbits'

export default function ProjectDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data: project, isLoading, error } = useProject(slug)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse py-8">
        <div className="h-6 w-32 bg-panel rounded-lg" />
        <div className="h-12 w-3/4 bg-panel rounded-lg" />
        <div className="h-80 w-full bg-panel rounded-2xl" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-4 py-16">
        <h2 className="text-2xl font-bold text-text">Project Not Found</h2>
        <p className="text-sm text-muted">
          The requested project "{slug}" does not exist or has not been published yet.
        </p>
        <Link to="/projects">
          <Button variant="secondary" size="md" className="mt-2">
            ← Return to Projects
          </Button>
        </Link>
      </div>
    )
  }

  // Combine cover and gallery for lightbox navigation
  const galleryUrls: string[] = []
  if (project.cover_url) galleryUrls.push(project.cover_url)
  if (Array.isArray(project.gallery)) {
    project.gallery.forEach((img: any) => {
      if (typeof img === 'string') galleryUrls.push(img)
      else if (img?.url) galleryUrls.push(img.url)
    })
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="space-y-4 border-b border-border/60 pb-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="rounded-full bg-accent/15 border border-accent/30 px-3 py-1 text-xs font-semibold text-accent uppercase">
            {project.category}
          </span>
          {project.language && (
            <Badge variant="outline" className="text-xs uppercase font-mono">
              {project.language}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-text tracking-tight">
          <DecryptedText text={project.title} speed={25} />
        </h1>

        {project.outcome && (
          <div className="rounded-xl bg-green/10 border border-green/20 p-3 sm:p-4 text-xs sm:text-sm text-green font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{project.outcome}</span>
          </div>
        )}

        <p className="text-base text-muted leading-relaxed">
          {project.short_description}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-accent/90 transition-all shadow-sm"
            >
              <span>Live Demo</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel px-5 py-2.5 text-xs sm:text-sm font-medium text-text hover:bg-border/60 transition-colors"
            >
              <Github className="h-4 w-4 text-muted" />
              <span>Source Code</span>
            </a>
          )}
          {project.video_url && (
            <a
              href={project.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel px-5 py-2.5 text-xs sm:text-sm font-medium text-purple hover:bg-border/60 transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Watch Video</span>
            </a>
          )}
        </div>

        {/* Tech Stack Chips */}
        {project.tech && project.tech.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <span className="text-xs text-muted flex items-center gap-1 font-medium">
              <Layers className="h-3.5 w-3.5" />
              <span>Technologies:</span>
            </span>
            {project.tech.map((t, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-border bg-panel px-3 py-1 text-xs text-text font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Cover Image */}
      {project.cover_url && (
        <div
          onClick={() => openLightbox(0)}
          className="rounded-2xl border border-border overflow-hidden bg-panel cursor-pointer group relative shadow-md"
        >
          <img
            src={project.cover_url}
            alt={project.title}
            className="w-full max-h-[500px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition-opacity font-medium">
            Click to view full preview
          </div>
        </div>
      )}

      {/* Detailed Content Sections */}
      <div className="space-y-10">
        {/* The Problem / Challenge */}
        {project.problem_md && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-text">The Challenge</h2>
            <div className="prose prose-invert max-w-none text-muted text-sm sm:text-base leading-relaxed">
              <Markdown remarkPlugins={[remarkGfm]}>{project.problem_md}</Markdown>
            </div>
          </div>
        )}

        {/* My Role & Architecture */}
        {project.role_md && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-text">Architecture & My Approach</h2>
            <div className="prose prose-invert max-w-none text-muted text-sm sm:text-base leading-relaxed">
              <Markdown remarkPlugins={[remarkGfm]}>{project.role_md}</Markdown>
            </div>
          </div>
        )}

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-text">Key Features & Capabilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-panel p-3.5 flex items-start gap-2.5 text-sm text-text"
                >
                  <CheckCircle2 className="h-4 w-4 text-green shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What I Learned */}
        {project.learned_md && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-text">Key Learnings & Takeaways</h2>
            <div className="prose prose-invert max-w-none text-muted text-sm sm:text-base leading-relaxed">
              <Markdown remarkPlugins={[remarkGfm]}>{project.learned_md}</Markdown>
            </div>
          </div>
        )}

        {/* Project Gallery */}
        {galleryUrls.length > 1 && (
          <div className="space-y-4 pt-4 border-t border-border/60">
            <h2 className="text-xl font-bold text-text">Project Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryUrls.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx)}
                  className="h-36 sm:h-44 rounded-xl border border-border overflow-hidden cursor-pointer hover:border-accent transition-all group shadow-xs"
                >
                  <img
                    src={url}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && galleryUrls.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white hover:text-accent p-2 rounded-lg bg-panel/80 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {galleryUrls.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((prev) => (prev - 1 + galleryUrls.length) % galleryUrls.length)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-panel text-white hover:bg-border transition-colors shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((prev) => (prev + 1) % galleryUrls.length)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-panel text-white hover:bg-border transition-colors shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <img
            src={galleryUrls[lightboxIndex]}
            alt="Expanded view"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
