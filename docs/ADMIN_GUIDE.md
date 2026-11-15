# Admin Portal Guide — Anuj Yadav Portfolio

The Admin Portal is a built-in CMS dashboard that lets you manage 100% of the portfolio content dynamically without writing code or redeploying the site to Netlify.

---

## 1. Accessing the Admin Portal

- **URL:** `https://your-domain.netlify.app/admin` (or `http://localhost:5173/admin` during development)
- **Login Credentials:** Use the email and password you created in your Supabase Auth dashboard.
- **Local Dev Bypass:** During local development before Supabase is connected, a "Dev Mode: Instant Preview as Admin" link is available directly on the login page.

---

## 2. Admin Modules Overview

### 📊 1. Overview Dashboard (`/admin`)
- **Key Metrics:** Live counts of published projects, unread contact form messages, technical skills, and verified certificates.
- **Recent Transmissions:** Preview of the latest incoming messages with sender details and timestamps.
- **Quick Actions:** One-click shortcuts to add a new project case study, upload a new resume PDF, or preview the live public site.

---

### 🚀 2. Projects (`/admin/projects`)
- **Adding a Project:** Click **"Add New Project"** to open the full project modal.
- **Editable Fields:**
  - **Title & Slug:** Title automatically generates a clean URL slug (e.g. `devconnect`).
  - **Category:** Choose between `--web`, `--ml`, `--design`, or `--other`. These match the terminal filter flags on the public site.
  - **Language / File Extension:** e.g. `tsx`, `py`, `js`. This controls the icon and filename shown in the VS Code file tree and terminal (e.g. `devconnect.tsx`).
  - **Cover Image & Logo:** Upload directly via drag-and-drop. Images are compressed client-side before upload to Supabase Storage.
  - **Markdown Case Study:** Three distinct markdown editors for **Problem Statement**, **My Role & Architecture**, and **Key Learnings**.
  - **Key Features & Tech Chips:** Add tags by typing and pressing Enter.
  - **Live Demo, GitHub & Video URLs:** Displayed as interactive action buttons on the project detail view.
- **Publish Status:** Toggle between **Draft** (only visible to you in admin) and **Live** (immediately appears in the public file tree, projects grid, and terminal).
- **Featured Toggle:** Star projects to place them at the very top of the showcase.
- **Duplicate & Delete:** Quickly clone an existing project structure or permanently delete outdated entries with a confirmation check.

---

### 🛠 3. Skills & Technology Stack (`/admin/skills`)
- **Skill Groups:** Organize technologies into categories (`frontend`, `backend`, `database`, `ai_ml`, `languages`, `tools`) or create custom categories.
- **Skill Levels:**
  - **Strong:** Highlights in syntax green (production-level mastery).
  - **Comfortable:** Highlights in syntax blue (proficient experience).
  - **Learning:** Highlights in syntax orange (actively researching).
- **Hover Relationships:** Adding a skill automatically links it to projects that list that technology in their stack, powering the interactive hover highlighter on the public `/stack` page.

---

### 📜 4. Experience & Leadership (`/admin/experience`)
- **Git Log Format:** Each entry represents a role (e.g. *Technical Lead at ML Research Club, MITS* or *Graphics Team at MUN Club*).
- **Commit Hash:** The system automatically generates a unique git commit hash (e.g. `commit 2000000`) for the VS Code terminal timeline.
- **Start & End Dates:** Supports standard `YYYY-MM` or `present`.
- **Markdown Notes:** Supports full markdown for bullets and achievements.

---

### 🎓 5. Education & Credentials (`/admin/education`)
- **Degree Entries:** Manage your college degree, institute name (*MITS Gwalior*), enrollment years, and academic highlights.
- **Certificates:** Upload certificate credentials and badge images with issuer details and issue dates. Each certificate automatically gets a high-resolution lightbox modal on the public `/education` page.
- **Visibility Toggle:** Hide or reveal specific certificates without deleting them.

---

### ⚙️ 6. Global Site Settings (`/admin/settings`)
- **Bio & Overview Tab:** Edit full name, rotating hero roles (typed out on the README), one-line pitch, about markdown content, location, and the **"Open to internships"** availability badge.
- **Appearance & Media Tab:**
  - **Theme Accent Color:** Live color picker that changes the CSS variable `--color-accent` across the entire portfolio (blue, purple, green, orange, etc.).
  - **Profile Avatar:** Upload your headshot photo.
  - **Brand Logo:** Upload custom SVG or PNG logos.
- **Resume Document Tab:** Upload your PDF resume file. Download buttons and the embedded PDF viewer automatically link to this file.
- **Social Channels Tab:** Update your GitHub, LinkedIn, X (Twitter), Instagram, and email links.

---

### 📁 7. Media Asset Library (`/admin/media`)
- Directly browse, search, and manage all image assets stored in your Supabase `portfolio-media` storage bucket.
- One-click copy URL to easily reuse media inside Markdown descriptions or project cards.
- Safe deletion dialog with warnings.

---

### 📬 8. Messages Inbox (`/admin/messages`)
- Reads all transmissions dispatched through the public `./contact.sh` terminal prompt.
- **Unread Badge:** Displays real-time unread counts in the admin sidebar.
- **Read/Unread Toggle:** Mark messages as read after reviewing.
- **Reply by Email:** One-click `mailto:` shortcut pre-filled with the sender's name and subject.
