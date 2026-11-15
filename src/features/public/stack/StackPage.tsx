import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Code2,
  Sparkles,
  FolderGit2,
  Cpu,
  Layers,
  Database,
  Terminal,
  Brain,
  Wrench,
  CheckCircle2,
} from 'lucide-react'
import { useSkillsWithGroups, usePublicProjects } from '@/lib/queries'
import { DecryptedText } from '@/components/reactbits'

export default function StackPage() {
  const { data: skillsData, isLoading } = useSkillsWithGroups()
  const { data: projects = [] } = usePublicProjects()

  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null)

  // Find projects that use the hovered skill
  const relatedProjectIds = hoveredSkillId
    ? skillsData?.projectSkills
        ?.filter((ps) => ps.skill_id === hoveredSkillId)
        .map((ps) => ps.project_id) || []
    : []

  const relatedProjects = projects.filter((p) => relatedProjectIds.includes(p.id))

  const getGroupIcon = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('front')) return <Layers className="h-5 w-5 text-accent" />
    if (lower.includes('back')) return <Terminal className="h-5 w-5 text-green" />
    if (lower.includes('data')) return <Database className="h-5 w-5 text-purple" />
    if (lower.includes('ai') || lower.includes('ml')) return <Brain className="h-5 w-5 text-orange" />
    if (lower.includes('lang')) return <Code2 className="h-5 w-5 text-accent" />
    return <Wrench className="h-5 w-5 text-muted" />
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Strong':
        return (
          <span className="rounded-full bg-green/10 border border-green/30 px-2 py-0.5 text-[10px] font-semibold text-green">
            Advanced
          </span>
        )
      case 'Comfortable':
        return (
          <span className="rounded-full bg-accent/10 border border-accent/30 px-2 py-0.5 text-[10px] font-semibold text-accent">
            Proficient
          </span>
        )
      case 'Learning':
        return (
          <span className="rounded-full bg-orange/10 border border-orange/30 px-2 py-0.5 text-[10px] font-semibold text-orange">
            Exploring
          </span>
        )
      default:
        return (
          <span className="rounded-full bg-muted/10 border border-border px-2 py-0.5 text-[10px] text-muted">
            {level}
          </span>
        )
    }
  }

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
          <DecryptedText text="Technical Skills & Expertise" speed={25} />
        </h1>
        <p className="text-sm sm:text-base text-muted mt-1.5 max-w-2xl">
          Core technologies, frameworks, and programming paradigms I utilize to architect scalable systems.
        </p>
      </div>

      {/* Legend & Interactive Note */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted bg-panel/60 border border-border/70 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-text">Proficiency:</span>
          <span className="flex items-center gap-1.5 text-green">
            <span className="h-2 w-2 rounded-full bg-green" />
            <span>Advanced</span>
          </span>
          <span className="flex items-center gap-1.5 text-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Proficient</span>
          </span>
          <span className="flex items-center gap-1.5 text-orange">
            <span className="h-2 w-2 rounded-full bg-orange" />
            <span>Exploring</span>
          </span>
        </div>
        <p className="text-[11px] text-muted">
          💡 Click or hover any skill to view associated projects.
        </p>
      </div>

      {/* Categorized Skills Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillsData?.groups?.map((group) => {
          const groupSkills = skillsData.skills.filter((s) => s.group_id === group.id)

          return (
            <div
              key={group.id}
              className="rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-6 space-y-4 hover:border-accent/40 hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.12)] transition-all shadow-sm"
            >
              {/* Group Header */}
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
                {getGroupIcon(group.name)}
                <h3 className="font-bold text-text text-base capitalize tracking-wide">
                  {group.name.replace(/_/g, ' ')}
                </h3>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2 pt-1">
                {groupSkills.map((skill) => {
                  const isHovered = hoveredSkillId === skill.id

                  return (
                    <button
                      type="button"
                      key={skill.id}
                      onMouseEnter={() => setHoveredSkillId(skill.id)}
                      onMouseLeave={() => setHoveredSkillId(null)}
                      onClick={() =>
                        setHoveredSkillId(hoveredSkillId === skill.id ? null : skill.id)
                      }
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-accent/15 border-accent text-accent scale-105 shadow-xs'
                          : 'bg-bg/90 border-border/80 text-text hover:border-accent/50 hover:bg-bg'
                      }`}
                    >
                      <span>{skill.name}</span>
                      {getLevelBadge(skill.level)}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Related Projects Dynamic Callout */}
      {hoveredSkillId && (
        <div className="rounded-2xl border border-accent/40 bg-panel/95 p-6 space-y-3 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2 text-sm text-accent font-semibold">
            <FolderGit2 className="h-4 w-4" />
            <span>
              Projects featuring{' '}
              {skillsData?.skills?.find((s) => s.id === hoveredSkillId)?.name}:
            </span>
          </div>

          {relatedProjects.length === 0 ? (
            <p className="text-xs text-muted">
              Used across academic problem sets, open-source pull requests, and ongoing experimental repositories.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3 pt-1">
              {relatedProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.slug}`}
                  className="rounded-xl border border-border bg-bg px-4 py-2 text-xs text-text hover:text-accent hover:border-accent transition-all flex items-center gap-2 shadow-xs"
                >
                  <span className="font-semibold">{p.title}</span>
                  <span className="text-[11px] text-accent">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
