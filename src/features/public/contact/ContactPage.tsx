import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { contactSchema, ContactFormData } from '@/lib/schemas'
import { useSendMessage, useSettings } from '@/lib/queries'
import { DecryptedText } from '@/components/reactbits'
import { Button } from '@/components/ui/Button'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)

  const { data: settings } = useSettings()
  const sendMessageMutation = useSendMessage()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      honeypot: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setRateLimitError(null)

    // Honeypot check for bots
    if (data.honeypot && data.honeypot.length > 0) {
      console.warn('Bot detected by honeypot')
      return
    }

    // Rate limiting check using sessionStorage (60s minimum interval)
    const lastSent = sessionStorage.getItem('last_message_time')
    const now = Date.now()
    if (lastSent && now - parseInt(lastSent, 10) < 60000) {
      setRateLimitError('Please wait at least 60 seconds before sending another message.')
      return
    }

    try {
      await sendMessageMutation.mutateAsync({
        name: data.name,
        email: data.email,
        message: data.message,
      })

      sessionStorage.setItem('last_message_time', now.toString())
      setSubmitted(true)
      reset()
    } catch (err: any) {
      console.error('Failed to send message:', err)
      setRateLimitError(err.message || 'Failed to send message. Please try again.')
    }
  }

  const socialLinks = (settings?.social_links as any) || {
    github: 'https://github.com/anujyad810-dot',
    linkedin: 'https://linkedin.com/in/anuj-yadav-01748538a',
    twitter: 'https://x.com/anujyad810',
    instagram: 'https://instagram.com/anujyad810',
    email: 'anujyad810@gmail.com',
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
          <DecryptedText text="Get In Touch" speed={25} />
        </h1>
        <p className="text-sm sm:text-base text-muted mt-1.5 max-w-2xl">
          Have an opportunity, question, or project inquiry? Send a message directly to my inbox.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Left: Contact Form (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-6 sm:p-8 shadow-sm space-y-6 hover:border-accent/40 transition-colors">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
            <MessageSquare className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-text">Send a Message</h2>
          </div>

          {submitted ? (
            <div className="rounded-xl bg-green/10 border border-green/30 p-8 text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="h-12 w-12 text-green mx-auto" />
              <h3 className="text-lg font-bold text-text">Message Sent Successfully!</h3>
              <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. Your message has been saved in my admin inbox and I'll
                get back to you as soon as possible.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Hidden honeypot field for bot spam detection */}
              <input
                type="text"
                {...register('honeypot')}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. John Doe / Hiring Team"
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="e.g. john@company.com"
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  rows={5}
                  {...register('message')}
                  placeholder="Share details about the project, role, or inquiry..."
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-y"
                />
                {errors.message && (
                  <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>
                )}
              </div>

              {rateLimitError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{rateLimitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isSubmitting || sendMessageMutation.isPending}
                  className="w-full sm:w-auto px-6 cursor-pointer"
                >
                  <Send className="h-4 w-4 mr-2" />
                  <span>Send Message</span>
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Direct Information & Social Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Info Card */}
          <div className="rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-6 space-y-4 shadow-sm hover:border-accent/40 transition-colors">
            <h3 className="font-bold text-text text-base">Direct Channels</h3>
            <div className="space-y-3 text-xs sm:text-sm text-muted">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-green shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-text">Email</p>
                  <a
                    href={`mailto:${socialLinks.email}`}
                    className="hover:underline text-muted hover:text-green"
                  >
                    {socialLinks.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-text">Location</p>
                  <p>{settings?.location || 'Gwalior, Madhya Pradesh, India'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-purple shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-text">Availability</p>
                  <p>{settings?.availability_text || 'Open to internships & projects'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Profiles Grid */}
          <div className="rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-6 space-y-4 shadow-sm hover:border-accent/40 transition-colors">
            <h3 className="font-bold text-text text-base">Social Profiles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-bg p-3 text-text hover:text-accent hover:border-accent/50 transition-all shadow-xs"
                >
                  <Github className="h-4 w-4" />
                  <span className="font-medium">GitHub</span>
                </a>
              )}

              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-bg p-3 text-text hover:text-accent hover:border-accent/50 transition-all shadow-xs"
                >
                  <Linkedin className="h-4 w-4 text-[#0077b5]" />
                  <span className="font-medium">LinkedIn</span>
                </a>
              )}

              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-bg p-3 text-text hover:text-sky-400 hover:border-sky-400/50 transition-all shadow-xs"
                >
                  <Twitter className="h-4 w-4 text-sky-400" />
                  <span className="font-medium">X (Twitter)</span>
                </a>
              )}

              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-bg p-3 text-text hover:text-pink-400 hover:border-pink-400/50 transition-all shadow-xs"
                >
                  <Instagram className="h-4 w-4 text-pink-400" />
                  <span className="font-medium">Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
