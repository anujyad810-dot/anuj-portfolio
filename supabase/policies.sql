-- ============================================================
-- policies.sql — Row Level Security (RLS) Policies
-- Strict access control: Public read-only, Admin full-access
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Helper: Security definer function checking admin_users table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 1. admin_users
CREATE POLICY "admin_users_select_self" ON admin_users
  FOR SELECT USING (id = auth.uid());

-- 2. settings
CREATE POLICY "settings_public_read" ON settings
  FOR SELECT USING (true);

CREATE POLICY "settings_admin_write" ON settings
  FOR ALL USING (is_admin());

-- 3. projects
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT USING (published = true);

CREATE POLICY "projects_admin_all" ON projects
  FOR ALL USING (is_admin());

-- 4. skill_groups
CREATE POLICY "skill_groups_public_read" ON skill_groups
  FOR SELECT USING (true);

CREATE POLICY "skill_groups_admin_write" ON skill_groups
  FOR ALL USING (is_admin());

-- 5. skills
CREATE POLICY "skills_public_read" ON skills
  FOR SELECT USING (true);

CREATE POLICY "skills_admin_write" ON skills
  FOR ALL USING (is_admin());

-- 6. project_skills
CREATE POLICY "project_skills_public_read" ON project_skills
  FOR SELECT USING (true);

CREATE POLICY "project_skills_admin_write" ON project_skills
  FOR ALL USING (is_admin());

-- 7. experience
CREATE POLICY "experience_public_read" ON experience
  FOR SELECT USING (true);

CREATE POLICY "experience_admin_write" ON experience
  FOR ALL USING (is_admin());

-- 8. education
CREATE POLICY "education_public_read" ON education
  FOR SELECT USING (true);

CREATE POLICY "education_admin_write" ON education
  FOR ALL USING (is_admin());

-- 9. certificates
CREATE POLICY "certificates_public_read" ON certificates
  FOR SELECT USING (visible = true);

CREATE POLICY "certificates_admin_write" ON certificates
  FOR ALL USING (is_admin());

-- 10. messages
CREATE POLICY "messages_public_insert" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "messages_admin_select" ON messages
  FOR SELECT USING (is_admin());

CREATE POLICY "messages_admin_update" ON messages
  FOR UPDATE USING (is_admin());

CREATE POLICY "messages_admin_delete" ON messages
  FOR DELETE USING (is_admin());
