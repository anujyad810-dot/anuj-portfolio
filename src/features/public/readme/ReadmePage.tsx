import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Download,
  Mail,
  FolderGit2,
  Cpu,
  Award,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import {
  TextType,
  ShinyText,
  GradientText,
  Magnet,
  CountUp,
  SpotlightCard,
} from '@/components/reactbits'
import { useSettings, useSkillsWithGroups, usePublicProjects } from '@/lib/queries'

export default function ReadmePage() {
  const { data: settings } = useSettings()
  const { data: projects = [] } = usePublicProjects()
  const { data: skillsData } = useSkillsWithGroups()

  const name = settings?.name || 'Anuj Yadav'
  const roles =
    settings?.roles && settings.roles.length > 0
      ? settings.roles
      : ['Full-Stack Developer', 'ML Enthusiast', 'UI/UX Designer']
  const pitch =
    settings?.pitch ||
    'Building fast, clean, and intelligent web experiences. Student at MITS Gwalior with a passion for software craftsmanship.'
  const availability = settings?.availability_text || 'Open to internships'
  const location = settings?.location || 'Gwalior, India'

  const totalSkillsCount = skillsData?.skills?.length || 18
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 2)

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-14 pb-6 max-w-4xl mx-auto text-center flex flex-col items-center space-y-6">
        {/* Logo Image in Curved Square Box */}
        <div className="relative group">
          <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl border-2 border-border/80 bg-white/90 backdrop-blur-md p-2.5 shadow-md group-hover:shadow-xl group-hover:border-accent/60 transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={`${name} Logo`}
                className="w-full h-full object-contain rounded-2xl"
              />
            ) : settings?.avatar_url ? (
              <img
                src={settings.avatar_url}
                alt={`${name} Avatar`}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-accent/15 via-accent/5 to-panel border border-accent/25 flex flex-col items-center justify-center font-mono font-extrabold text-accent">
                <span className="text-3xl sm:text-4xl tracking-tighter">AY</span>
                <span className="text-[9px] tracking-widest text-muted uppercase font-sans font-semibold mt-0.5">PORTFOLIO</span>
              </div>
            )}
          </div>
          {/* Subtle glow effect behind curved square */}
          <div className="absolute -inset-1 rounded-3xl bg-accent/20 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-4 py-1.5 text-xs backdrop-blur-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green"></span>
          </span>
          <ShinyText text={availability} className="font-medium text-green" speed={3} />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text leading-tight">
          Hi, I'm <GradientText>{name}</GradientText>
        </h1>

        {/* Dynamic Rotating Roles */}
        <div className="text-xl sm:text-3xl text-muted font-medium flex flex-wrap items-center justify-center gap-2">
          <span>I engineer</span>
          <TextType
            words={roles}
            className="text-accent font-semibold"
            typingSpeed={70}
            deletingSpeed={40}
            pauseDuration={1600}
          />
        </div>

        {/* Pitch Statement */}
        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed font-sans">
          {pitch}
        </p>

        {/* Location & Quick Info */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted">
          <MapPin className="h-4 w-4 text-accent" />
          <span>Based in {location}</span>
          <span>•</span>
          <span>B.Tech CSE Student @ MITS</span>
        </div>

        {/* Call to Actions wrapped in Magnet */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Magnet magnetStrength={3} padding={30}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-all shadow-md hover:shadow-lg hover:shadow-accent/25 cursor-pointer"
            >
              <span>Explore Projects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnet>

          <Magnet magnetStrength={3} padding={30}>
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel/80 backdrop-blur-md px-6 py-3 text-sm font-medium text-text hover:bg-border/60 hover:border-accent/40 transition-all cursor-pointer shadow-xs"
            >
              <Download className="h-4 w-4 text-accent" />
              <span>Resume</span>
            </Link>
          </Magnet>

          <Magnet magnetStrength={3} padding={30}>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-panel/50 backdrop-blur-md px-5 py-3 text-sm font-medium text-muted hover:text-text hover:border-border transition-all cursor-pointer"
            >
              <Mail className="h-4 w-4 text-green" />
              <span>Contact</span>
            </Link>
          </Magnet>
        </div>
      </section>

      {/* Metrics & Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-border/80 bg-panel/75 p-5 backdrop-blur-md hover:border-accent/50 hover:shadow-[0_0_20px_-5px_rgba(2,132,199,0.15)] transition-all shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Projects</span>
            <FolderGit2 className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-text">
            <CountUp to={projects.length} duration={1.2} />
            <span className="text-accent text-lg ml-0.5">+</span>
          </div>
          <p className="text-[11px] text-muted mt-1">Full-stack & ML apps</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-panel/75 p-5 backdrop-blur-md hover:border-green/50 hover:shadow-[0_0_20px_-5px_rgba(5,150,105,0.15)] transition-all shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Skills</span>
            <Cpu className="h-4 w-4 text-green" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-text">
            <CountUp to={totalSkillsCount} duration={1.5} />
            <span className="text-green text-lg ml-0.5">+</span>
          </div>
          <p className="text-[11px] text-muted mt-1">Languages & frameworks</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-panel/75 p-5 backdrop-blur-md hover:border-purple/50 hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.15)] transition-all shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Leadership</span>
            <Award className="h-4 w-4 text-purple" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-text">
            <span>2</span>
            <span className="text-xs font-normal text-muted ml-1.5">Clubs</span>
          </div>
          <p className="text-[11px] text-muted mt-1">Tech Lead @ ML Club</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-panel/75 p-5 backdrop-blur-md hover:border-orange/50 hover:shadow-[0_0_20px_-5px_rgba(234,88,12,0.15)] transition-all shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Education</span>
            <Sparkles className="h-4 w-4 text-orange" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-text">
            <span>B.Tech</span>
          </div>
          <p className="text-[11px] text-muted mt-1">CS & Design @ MITS</p>
        </div>
      </section>

      {/* Featured Projects Highlight Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-text">Featured Work</h2>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Selected projects highlighting full-stack engineering and intelligent systems.
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs sm:text-sm font-semibold text-accent hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project) => (
            <SpotlightCard
              key={project.id}
              className="p-6 flex flex-col justify-between hover:border-accent/60 transition-all group rounded-2xl bg-panel/80 backdrop-blur-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/15 border border-accent/30 px-2.5 py-0.5 text-[11px] font-semibold text-accent uppercase">
                    {project.category}
                  </span>
                  {project.outcome && (
                    <span className="text-[11px] text-green font-medium">
                      ✨ {project.outcome}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs sm:text-sm text-muted line-clamp-3 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>

                {/* Tech Chips */}
                {project.tech && project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-bg/90 px-2.5 py-1 text-[11px] text-muted border border-border/60 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-border/40 flex items-center justify-between text-xs">
                <Link
                  to={`/projects/${project.slug}`}
                  className="font-semibold text-accent hover:underline"
                >
                  View Case Study →
                </Link>
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-text flex items-center gap-1"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Quick About / Callout Banner */}
      <section className="rounded-2xl border border-border/80 bg-gradient-to-br from-panel/90 via-panel/75 to-bg/90 backdrop-blur-xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md hover:border-accent/40 transition-colors">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-text">Want to collaborate or chat?</h3>
          <p className="text-xs sm:text-sm text-muted max-w-xl leading-relaxed">
            I'm currently seeking software engineering internships and open to exciting freelance
            or research opportunities.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-all shrink-0 shadow-sm hover:shadow-accent/25 hover:shadow-md"
        >
          <span>Get In Touch</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
