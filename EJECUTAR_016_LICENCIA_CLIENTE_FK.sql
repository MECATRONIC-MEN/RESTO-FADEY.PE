-- OBLIGATORIO si al eliminar licencias sale: clients_license_id_fkey
-- Ejecutar completo en Supabase SQL Editor → Run

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'clients'
      AND c.contype = 'f'
      AND pg_get_constraintdef(c.oid) ILIKE '%licenses%'
  LOOP
    EXECUTE format('ALTER TABLE clients DROP CONSTRAINT IF EXISTS %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE clients
  ADD CONSTRAINT clients_license_id_fkey
  FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE SET NULL;
