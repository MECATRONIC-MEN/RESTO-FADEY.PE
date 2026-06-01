-- Ejecutar en Supabase SQL Editor
ALTER TABLE licenses
  ADD COLUMN IF NOT EXISTS never_expires BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE licenses
  ALTER COLUMN expires_at DROP NOT NULL;
