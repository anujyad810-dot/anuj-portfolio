-- ============================================================
-- storage.sql — Supabase Storage Buckets & Policies
-- Creates public buckets with admin-only upload/modify permissions
-- ============================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('portfolio-media', 'portfolio-media', true),
  ('resume', 'resume', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for 'portfolio-media'
CREATE POLICY "portfolio_media_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-media');

CREATE POLICY "portfolio_media_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-media' AND is_admin());

CREATE POLICY "portfolio_media_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-media' AND is_admin());

CREATE POLICY "portfolio_media_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-media' AND is_admin());

-- Policies for 'resume'
CREATE POLICY "resume_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resume');

CREATE POLICY "resume_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resume' AND is_admin());

CREATE POLICY "resume_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'resume' AND is_admin());

CREATE POLICY "resume_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'resume' AND is_admin());
