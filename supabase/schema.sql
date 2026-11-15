-- ============================================================
-- schema.sql — Anuj Yadav Portfolio Database Schema
-- Production Ready with Full RLS & Storage
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. admin_users (References auth.users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 2. settings (Single-row site configuration)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL DEFAULT 'Anuj Yadav',
  roles TEXT[] NOT NULL DEFAULT ARRAY['Full-Stack Developer', 'ML Enthusiast', 'Designer'],
  pitch TEXT NOT NULL DEFAULT 'Building fast, clean, and intelligent web experiences.',
  about_md TEXT NOT NULL DEFAULT '## About Me\n\nHi! I am Anuj Yadav, a B.Tech CSE student at MITS Gwalior.',
  currently_learning TEXT[] NOT NULL DEFAULT ARRAY['System Design', 'LLM Fine-tuning'],
  interests TEXT[] NOT NULL DEFAULT ARRAY['Open Source', 'AI/ML', 'UI/UX'],
  availability_text TEXT NOT NULL DEFAULT 'Open to internships',
  location TEXT NOT NULL DEFAULT 'Gwalior, India',
  contact_email TEXT NOT NULL DEFAULT 'anujyad810@gmail.com',
  accent_color TEXT NOT NULL DEFAULT '#58a6ff',
  logo_url TEXT,
  favicon_url TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  social_links JSONB NOT NULL DEFAULT '{"github":"https://github.com/anujyad810-dot","linkedin":"https://linkedin.com/in/anuj-yadav-01748538a","twitter":"https://x.com/anujyad810","instagram":"https://instagram.com/anujyad810","email":"anujyad810@gmail.com"}'::jsonb,
  seo JSONB NOT NULL DEFAULT '{"title":"Anuj Yadav | Portfolio","description":"Full-Stack Developer & ML Enthusiast"}'::jsonb,
  sections_visibility JSONB NOT NULL DEFAULT '{"projects":true,"skills":true,"experience":true,"education":true,"certificates":true}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure default row exists
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 3. projects
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'web',
  language TEXT NOT NULL DEFAULT 'tsx',
  short_description TEXT NOT NULL DEFAULT '',
  outcome TEXT,
  problem_md TEXT,
  role_md TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  learned_md TEXT,
  tech TEXT[] NOT NULL DEFAULT '{}',
  logo_url TEXT,
  cover_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]',
  demo_url TEXT,
  github_url TEXT,
  video_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 4. skill_groups
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- 5. skills
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES skill_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Learning', 'Comfortable', 'Strong')),
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- 6. project_skills (Many-to-many)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_skills (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

-- ------------------------------------------------------------
-- 7. experience (Git Log entries)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organisation TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description_md TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- 8. education
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree TEXT NOT NULL,
  institute TEXT NOT NULL,
  start_year INT NOT NULL,
  end_year INT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- 9. certificates
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issued_on TEXT NOT NULL,
  image_url TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- 10. messages (Contact form inbox)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Triggers for updated_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
