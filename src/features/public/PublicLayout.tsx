import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  ArrowUp,
  Code2,
  Lock,
} from 'lucide-react'
import { ClickSpark } from '@/components/reactbits/ClickSpark'
import { AntigravityDots } from '@/components/reactbits/AntigravityDots'
import { useSettings } from '@/lib/queries'

export function PublicLayout() {
  const { data: settings } = useSettings()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Scroll to top on route change & close mobile menu
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Track scroll position for navbar glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Experience', path: '/experience' },
    { name: 'Education', path: '/education' },
    { name: 'Resume', path: '/resume' },
    { name: 'Contact', path: '/contact' },
  ]

  const socialLinks = (settings?.social_links as any) || {
    github: 'https://github.com/anujyad810-dot',
    linkedin: 'https://linkedin.com/in/anuj-yadav-01748538a',
    twitter: 'https://x.com/anujyad810',
    instagram: 'https://instagram.com/anujyad810',
    email: 'anujyad810@gmail.com',
  }

  const name = settings?.name || 'Anuj Yadav'

  return (
    <ClickSpark sparkColor="var(--color-accent)" sparkCount={6} sparkRadius={24}>
      <div className="relative min-h-screen flex flex-col bg-bg text-text transition-colors duration-200">
        {/* Interactive Google Antigravity Dots Background (Reacts to cursor hover & click on white theme) */}
        <AntigravityDots
          spacing={34}
          dotSize={1.6}
          interactionRadius={130}
          accentColor={settings?.accent_color || '#0284c7'}
        />

        {/* Ambient Top Glow */}
        <div className="antigravity-glow fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 pointer-events-none z-0 opacity-70" />

        {/* Modern Sticky Navigation Bar */}
        <header
          className={`sticky top-0 z-40 w-full transition-all duration-200 ${
            scrolled
              ? 'bg-white/90 backdrop-blur-xl border-b border-border shadow-xs'
              : 'bg-white/70 backdrop-blur-md border-b border-border/40'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo / Brand Name */}
            <Link
              to="/"
              className="group flex items-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight text-text hover:text-accent transition-colors"
            >
              <div className="h-9 w-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-mono font-bold group-hover:scale-105 group-hover:shadow-[0_0_15px_-3px_var(--color-accent)] transition-all">
                AY
              </div>
              <div className="flex flex-col">
                <span className="leading-tight">{name}</span>
                <span className="text-[10px] text-muted font-mono font-normal">Full-Stack & ML</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path === '/skills' && location.pathname === '/stack') ||
                  (link.path === '/experience' &&
                    (location.pathname === '/git-log' || location.pathname === '/gitlog'))

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                      isActive
                        ? 'text-accent bg-accent/10 border border-accent/25 font-semibold shadow-xs'
                        : 'text-muted hover:text-text hover:bg-panel'
                    }`}
                  >
                    {link.name}
                  </NavLink>
                )
              })}
            </nav>

            {/* Right Action Bar (Contact CTA + Mobile Button) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Contact Button */}
              <Link
                to="/contact"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-accent font-medium hover:text-white px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent transition-all font-sans shadow-xs"
              >
                <span>Get in touch</span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl border border-border bg-panel text-text hover:border-accent/50 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-border bg-white/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-1 animate-fade-in shadow-xl">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path === '/skills' && location.pathname === '/stack') ||
                  (link.path === '/experience' &&
                    (location.pathname === '/git-log' || location.pathname === '/gitlog'))

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-accent bg-accent/10 border border-accent/25 font-semibold'
                        : 'text-muted hover:text-text hover:bg-panel'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted">
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-accent font-mono py-1"
                >
                  Admin Portal →
                </Link>
                <div className="flex items-center gap-3">
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-text p-1"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-text p-1"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
          <Outlet />
        </main>

        {/* Modern Footer */}
        <footer className="relative z-10 w-full border-t border-border/80 bg-panel/80 backdrop-blur-md mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left Brand & Copyright */}
              <div className="text-center sm:text-left space-y-1">
                <p className="text-sm font-semibold text-text flex items-center justify-center sm:justify-start gap-1.5">
                  <span>{name}</span>
                  <span className="text-muted font-normal">• Portfolio</span>
                </p>
                <p className="text-xs text-muted flex items-center justify-center sm:justify-start gap-2">
                  <span>Designed & built with React, TypeScript & Supabase.</span>
                  <Link
                    to="/admin/login"
                    className="opacity-25 hover:opacity-90 text-muted hover:text-accent transition-all p-0.5"
                    title="Admin"
                    aria-label="Admin"
                  >
                    <Lock className="h-3 w-3" />
                  </Link>
                </p>
              </div>

              {/* Center Social Links */}
              <div className="flex items-center gap-3 text-muted">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="p-2 rounded-xl hover:bg-border/60 hover:text-text transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="p-2 rounded-xl hover:bg-border/60 hover:text-accent transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter Profile"
                    className="p-2 rounded-xl hover:bg-border/60 hover:text-sky-500 transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Profile"
                    className="p-2 rounded-xl hover:bg-border/60 hover:text-pink-500 transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {socialLinks.email && (
                  <a
                    href={`mailto:${socialLinks.email}`}
                    aria-label="Email Address"
                    className="p-2 rounded-xl hover:bg-border/60 hover:text-green transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Right Back to Top Button */}
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text hover:bg-panel px-3 py-1.5 rounded-xl border border-border/80 transition-colors cursor-pointer backdrop-blur-xs shadow-2xs"
              >
                <span>Back to top</span>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </ClickSpark>
  )
}

export default PublicLayout
