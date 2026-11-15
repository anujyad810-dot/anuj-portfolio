import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MapPin, Mail, Sparkles, BookOpen, Heart, User, CheckCircle2 } from 'lucide-react'
import { useSettings } from '@/lib/queries'
import { DecryptedText } from '@/components/reactbits'

export default function AboutPage() {
  const { data: settings } = useSettings()

  const name = settings?.name || 'Anuj Yadav'
  const aboutMd =
    settings?.about_md ||
    `## Hello! I'm Anuj Yadav 👋

I am a passionate software engineer and student currently pursuing **B.Tech in Computer Science & Design** at **Madhav Institute of Technology & Science (MITS), Gwalior** (2024–present).

### 🛠 What I Do
I specialize in full-stack web engineering, building responsive, accessible interfaces with modern frameworks, robust APIs, and scalable databases. I also conduct research in machine learning and deep learning, serving as **Technical Lead** at the **ML Research Club, MITS**.

### 💡 Beyond the Code
When I'm not writing code or experimenting with neural nets, I design digital assets and visual media with the **Graphics Team at MUN Club**, participate in hackathons, and contribute to open-source software.`

  const interests = settings?.interests || [
    'Artificial Intelligence',
    'Open Source',
    'System Design',
    'UI/UX Design',
    'Competitive Programming',
  ]
  const currentlyLearning = settings?.currently_learning || [
    'System Design',
    'LLM Fine-tuning',
    'Distributed Systems',
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
          <DecryptedText text="About Me" speed={25} />
        </h1>
        <p className="text-sm sm:text-base text-muted mt-1.5">
          Engineering scalable web systems, exploring neural architectures, and crafting intuitive user experiences.
        </p>
      </div>

      {/* Main Grid: Content (Left) + Profile Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left: Markdown Story */}
        <div className="lg:col-span-2 space-y-6">
          <div className="prose prose-invert max-w-none text-text text-sm sm:text-base leading-relaxed space-y-4">
            <Markdown remarkPlugins={[remarkGfm]}>{aboutMd}</Markdown>
          </div>

          {/* Quick Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/60">
            <div className="rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-5 space-y-1.5 hover:border-accent/40 transition-colors shadow-xs">
              <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Full-Stack Craftsmanship</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Modern React ecosystem, TypeScript, Node.js, and relational/document databases.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-5 space-y-1.5 hover:border-accent/40 transition-colors shadow-xs">
              <div className="flex items-center gap-2 text-green font-semibold text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Machine Learning</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Computer vision, deep neural nets, and practical FastAPI inference pipelines.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Profile & Metadata Cards */}
        <div className="space-y-6">
          {/* Avatar / Bio Card */}
          <div className="rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-6 space-y-5 shadow-sm text-center hover:border-accent/40 transition-colors">
            {settings?.avatar_url ? (
              <img
                src={settings.avatar_url}
                alt={name}
                className="h-32 w-32 rounded-full border-2 border-accent object-cover mx-auto shadow-md"
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-accent/15 border-2 border-accent/40 flex items-center justify-center text-3xl font-bold text-accent mx-auto font-mono">
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
            )}

            <div className="space-y-1">
              <h3 className="font-bold text-text text-lg">{name}</h3>
              <p className="text-xs text-accent font-medium">B.Tech Student & Developer</p>
            </div>

            <div className="border-t border-border/60 pt-4 space-y-2.5 text-xs text-muted text-left">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <span>{settings?.location || 'Gwalior, India'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-green shrink-0" />
                <a
                  href={`mailto:${settings?.contact_email || 'anujyad810@gmail.com'}`}
                  className="hover:underline truncate"
                >
                  {settings?.contact_email || 'anujyad810@gmail.com'}
                </a>
              </div>
            </div>
          </div>

          {/* Interests Pill Card */}
          <div className="rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-6 space-y-3.5 shadow-sm hover:border-accent/40 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-text uppercase tracking-wider">
              <Heart className="h-4 w-4 text-pink-500" />
              <span>Interests & Focus</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="rounded-xl border border-border/80 bg-bg/80 px-3 py-1 text-xs text-muted hover:text-text hover:border-accent/40 transition-colors"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Currently Learning Card */}
          <div className="rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-6 space-y-3.5 shadow-sm hover:border-accent/40 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-text uppercase tracking-wider">
              <BookOpen className="h-4 w-4 text-accent" />
              <span>Currently Exploring</span>
            </div>
            <div className="space-y-2 text-xs text-muted">
              {currentlyLearning.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-accent font-bold">›</span>
                  <span className="text-text font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
