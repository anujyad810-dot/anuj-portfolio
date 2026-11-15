import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Lazy-loaded public pages
const PublicLayout = lazy(() => import('../features/public/PublicLayout'))
const ReadmePage = lazy(() => import('../features/public/readme/ReadmePage'))
const AboutPage = lazy(() => import('../features/public/about/AboutPage'))
const ProjectsPage = lazy(() => import('../features/public/projects/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('../features/public/projects/ProjectDetailPage'))
const StackPage = lazy(() => import('../features/public/stack/StackPage'))
const GitLogPage = lazy(() => import('../features/public/gitlog/GitLogPage'))
const EducationPage = lazy(() => import('../features/public/education/EducationPage'))
const ResumePage = lazy(() => import('../features/public/resume/ResumePage'))
const ContactPage = lazy(() => import('../features/public/contact/ContactPage'))
const NotFoundPage = lazy(() => import('../features/public/NotFoundPage'))

// Lazy-loaded admin pages
const AdminLayout = lazy(() => import('../features/admin/AdminLayout'))
const AdminGuard = lazy(() => import('../features/admin/auth/AdminGuard'))
const AdminLoginPage = lazy(() => import('../features/admin/auth/AdminLoginPage'))
const AdminDashboard = lazy(() => import('../features/admin/dashboard/AdminDashboard'))
const AdminProjects = lazy(() => import('../features/admin/projects/AdminProjects'))
const AdminSkills = lazy(() => import('../features/admin/skills/AdminSkills'))
const AdminExperience = lazy(() => import('../features/admin/experience/AdminExperience'))
const AdminEducation = lazy(() => import('../features/admin/education/AdminEducation'))
const AdminSettings = lazy(() => import('../features/admin/settings/AdminSettings'))
const AdminMedia = lazy(() => import('../features/admin/media/AdminMedia'))
const AdminMessages = lazy(() => import('../features/admin/messages/AdminMessages'))

function PageFallback() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-bg font-mono text-xs text-muted">
      Loading...
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<ReadmePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:slug" element={<ProjectDetailPage />} />
            <Route path="stack" element={<StackPage />} />
            <Route path="skills" element={<StackPage />} />
            <Route path="git-log" element={<GitLogPage />} />
            <Route path="gitlog" element={<GitLogPage />} />
            <Route path="experience" element={<GitLogPage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route
            path="admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="experience" element={<AdminExperience />} />
            <Route path="education" element={<AdminEducation />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
