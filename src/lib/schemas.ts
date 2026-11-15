import { z } from 'zod'

// ----------------------------------------------------------------
// Contact / Message schema
// ----------------------------------------------------------------
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  honeypot: z.string().max(0, 'Bot detected').optional(),
})
export type ContactFormData = z.infer<typeof contactSchema>

// ----------------------------------------------------------------
// Project schema
// ----------------------------------------------------------------
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  category: z.enum(['web', 'ml', 'design', 'other']).default('web'),
  language: z.string().default('tsx'),
  short_description: z.string().min(1, 'Short description is required').max(500),
  outcome: z.string().optional().nullable(),
  problem_md: z.string().optional().nullable(),
  role_md: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  learned_md: z.string().optional().nullable(),
  tech: z.array(z.string()).default([]),
  demo_url: z.string().url().optional().or(z.literal('')).nullable(),
  github_url: z.string().url().optional().or(z.literal('')).nullable(),
  video_url: z.string().url().optional().or(z.literal('')).nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})
export type ProjectFormData = z.infer<typeof projectSchema>

// ----------------------------------------------------------------
// Settings schema
// ----------------------------------------------------------------
export const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  roles: z.array(z.string()).default([]),
  pitch: z.string().min(1, 'Pitch is required'),
  about_md: z.string().default(''),
  currently_learning: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  availability_text: z.string().default('Open to internships'),
  location: z.string().default('Gwalior, India'),
  contact_email: z.string().email('Invalid email'),
  accent_color: z.string().default('#58a6ff'),
})
export type SettingsFormData = z.infer<typeof settingsSchema>

// ----------------------------------------------------------------
// Experience schema
// ----------------------------------------------------------------
export const experienceSchema = z.object({
  title: z.string().min(1, 'Role / Title is required'),
  organisation: z.string().min(1, 'Organisation is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().nullable(),
  description_md: z.string().default(''),
  sort_order: z.number().int().default(0),
})
export type ExperienceFormData = z.infer<typeof experienceSchema>

// ----------------------------------------------------------------
// Login schema
// ----------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
export type LoginFormData = z.infer<typeof loginSchema>
