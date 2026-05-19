-- Videos tutoriales por módulo del sistema

CREATE TABLE IF NOT EXISTS academy_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS duration TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_academy_videos_published ON academy_videos(is_published, sort_order);
