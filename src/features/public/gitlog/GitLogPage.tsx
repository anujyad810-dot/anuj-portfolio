import React, { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Briefcase, Calendar, ChevronDown, ChevronRight, Award, Building2 } from 'lucide-react'
import { useExperience } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import { DecryptedText } from '@/components/reactbits'

export default function GitLogPage() {
  const { data: experiences = [], isLoading } = useExperience()
  const [expandedIds, setExpandedIds] = useState<string[]>(
    // Default open first item
    experiences.length > 0 ? [experiences[0].id] : []
  )

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
          <DecryptedText text="Experience & Leadership" speed={25} />
        </h1>
        <p className="text-sm sm:text-base text-muted mt-1.5">
          Leadership roles, technical mentorship, and organizational contributions.
        </p>
      </div>

      {/* Modern Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/80">
        {experiences.map((exp, index) => {
          const isExpanded = expandedIds.includes(exp.id)
          const isLatest = index === 0

          return (
            <div key={exp.id} className="relative group">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-bg transition-colors ${
                  isLatest
                    ? 'border-accent text-accent shadow-sm shadow-accent/20'
                    : 'border-border text-muted group-hover:border-accent group-hover:text-accent'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
              </div>

              {/* Experience Card */}
              <div
                onClick={() => toggleExpand(exp.id)}
                className="rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-5 sm:p-6 hover:border-accent/50 hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.12)] transition-all cursor-pointer space-y-3 shadow-xs select-none"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-text group-hover:text-accent transition-colors flex items-center gap-2">
                      <span>{exp.title}</span>
                      {isLatest && (
                        <span className="rounded-full bg-accent/15 border border-accent/30 px-2.5 py-0.5 text-[10px] text-accent font-semibold uppercase tracking-wide">
                          Current
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-green font-medium">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{exp.organisation}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-full bg-bg border border-border px-3 py-1 text-xs text-muted">
                      <Calendar className="h-3.5 w-3.5 text-accent" />
                      <span>
                        {formatDate(exp.start_date)} — {formatDate(exp.end_date || 'present')}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-md text-muted hover:text-text hover:bg-bg transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand description'}
                      aria-label="Toggle details"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Markdown Description */}
                {isExpanded && (
                  <div className="pt-4 mt-2 border-t border-border/60 text-xs sm:text-sm text-muted leading-relaxed select-text space-y-2">
                    <Markdown remarkPlugins={[remarkGfm]}>{exp.description_md}</Markdown>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
