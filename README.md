# Anuj Yadav — Developer Portfolio & CMS

A production-ready developer portfolio website designed with a **VS Code workspace aesthetic**, an interactive data-driven terminal, real-time command palette, and a complete **built-in Admin CMS Portal**.

Everything on the public site (projects, case studies, technologies, leadership roles, education, certificates, resume, and social channels) is editable from the admin dashboard after logging in, with **zero code changes or redeploys needed**.

---

## ⚡ Tech Stack

- **Frontend:** React 19, Vite, TypeScript, React Router 7, Tailwind CSS
- **Animation & Visuals:** React Bits (`TextType`, `DecryptedText`, `ShinyText`, `GradientText`, `SpotlightCard`, `Magnet`, `ClickSpark`, `CountUp`, `Particles`) + Framer Motion
- **State & Data Fetching:** TanStack Query (React Query) with instant cache invalidation
- **Forms & Validation:** React Hook Form + Zod
- **Backend & Cloud (Zero Server to Maintain):** Supabase (PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security)
- **Deployment:** Netlify (`netlify.toml` included)

---

## 📁 Project Architecture

```
anuj-portfolio/
├── docs/                      # Comprehensive setup & deployment guides
│   ├── ADMIN_GUIDE.md         # Full admin dashboard walkthrough
│   ├── SUPABASE_SETUP.md      # Supabase database & auth guide
│   └── DEPLOYMENT.md          # Netlify continuous deployment steps
├── public/                    # Static favicon and assets
├── src/
│   ├── app/                   # App providers, router, and query client
│   ├── components/
│   │   ├── reactbits/         # React Bits visual components
│   │   ├── shell/             # VS Code shell: TitleBar, ActivityBar, Explorer, TabBar, StatusBar, Terminal, CommandPalette
│   │   └── ui/                # UI primitives: Button, Input, Modal, Toast, TagInput, MarkdownEditor, ImageUpload, FileUpload
│   ├── features/
│   │   ├── public/            # Public pages: README, About, Projects, Case Study, Stack, Git-log, Education, Resume, Contact, Recruiter Mode
│   │   └── admin/             # CMS modules: Dashboard, Projects CRUD, Skills CRUD, Experience CRUD, Education & Certs, Settings, Media Library, Inbox
│   ├── hooks/                 # Custom React hooks (useAuth, useTheme, useTabs, useRecruiterMode)
│   ├── lib/                   # Supabase client, queries, mutations, Zod schemas, utilities
│   └── styles/                # Tailwind CSS & design system variables
├── supabase/
│   ├── schema.sql             # Complete PostgreSQL database DDL
│   ├── policies.sql           # Strict Row Level Security (RLS) policies
│   ├── storage.sql            # Storage bucket definitions & security
│   └── seed.sql               # Seed data for Anuj Yadav
├── netlify.toml               # Netlify build & redirect rules
└── package.json
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials (a working placeholder fallback is included so the app compiles and runs immediately):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 💻 Exploring the Public Interface

- **VS Code Workspace:** Title bar with window controls, left Activity Bar, and collapsible file explorer sidebar (`ANUJ-PORTFOLIO/`).
- **Dynamic File Tree:**
  - `README.md` (`/`) — GitHub README home with typed heading, code object block, and animated counters.
  - `about.md` (`/about`) — Rendered Markdown biography and interests.
  - `projects/` (`/projects`) — Projects list with terminal flag filtering (`--all`, `--web`, `--ml`, `--design`).
  - `projects/:slug` (`/projects/:slug`) — Comprehensive case studies with lightbox gallery, problem, architecture, and takeaways.
  - `stack.json` (`/stack`) — Formatted JSON skills viewer with interactive hover linking to related projects.
  - `git-log` (`/git-log`) — Git commit timeline of leadership experience.
  - `education.md` (`/education`) — Academic milestones and certificate credentials with image lightboxes.
  - `resume.pdf` (`/resume`) — Embedded PDF preview and instant download.
  - `contact.sh` (`/contact`) — Terminal-styled dispatch form with honeypot spam protection.
- **Interactive Terminal:** Press `` Ctrl+` `` or click the terminal icon to execute live bash-style commands:
  - `help`, `about`, `projects`, `open <slug>`, `skills`, `resume`, `contact`, `whoami`, `theme dark|light`, `clear`, and the easter egg `sudo hire anuj`.
- **Command Palette:** Press `Ctrl+K` (or `Cmd+K`) to fuzzy search across pages and projects.
- **Recruiter Mode:** Click **"Recruiter Mode"** in the top title bar to toggle into a clean, traditional single-scroll format.

---

## 🛡️ Admin Portal (`/admin`)

Manage every piece of content dynamically:
1. Navigate to `/admin/login`.
2. Enter your administrator credentials. (During local testing without Supabase, click *[Dev Mode: Instant Preview as Admin]*).
3. Access all CMS modules:
   - **Projects:** Add, edit, duplicate, upload cover/gallery images, and toggle **Live/Draft** status.
   - **Skills:** Add new technologies, configure levels (*Strong*, *Comfortable*, *Learning*), and create groups.
   - **Experience:** Add positions, edit start/end dates, and markdown bullets.
   - **Education & Certifications:** Manage academic entries and certificate credentials.
   - **Site Settings:** Edit your name, roles, pitch, about markdown, theme accent color, avatar, logo, and resume PDF.
   - **Media Library:** Browse all uploaded images, copy direct URLs, and upload new assets.
   - **Messages Inbox:** View transmissions from visitors with read/unread toggles and one-click email replies.

For a full guide, see [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md).

---

## 🗄️ Supabase Database & Security

Detailed step-by-step instructions for running the schema and creating your admin user are in [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md).

- **Strict Row Level Security (RLS):** Anonymous visitors can only read published projects, settings, and public records, and can only insert into `messages`.
- **Admin Isolation:** All mutations and private records require membership in the `admin_users` table.
- **Image Compression:** Client-side compression before uploading to the `portfolio-media` storage bucket.

---

## 🌐 Netlify Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full instructions.

```bash
npm run build
```
Deploy the `dist/` folder to Netlify and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Netlify environment variables.

---

## 📄 License
MIT License. Created for Anuj Yadav.
