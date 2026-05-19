-- Ejecutar en Supabase SQL Editor (recursos de academia + URL de contenido en cursos)
-- Copia de migrations/010_academy_resources.sql

CREATE TABLE IF NOT EXISTS academy_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  resource_type TEXT NOT NULL DEFAULT 'documento',
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS content_url TEXT;

CREATE INDEX IF NOT EXISTS idx_academy_resources_published ON academy_resources(is_published, sort_order);
