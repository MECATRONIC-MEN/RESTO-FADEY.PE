-- Ejecutar en Supabase → SQL Editor → Run
-- Corrige: "Could not find the 'api_key' column of 'clients' in the schema cache"

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS api_key TEXT,
  ADD COLUMN IF NOT EXISTS system_version TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS pos_connection_status TEXT DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS pos_last_seen_at TIMESTAMPTZ;

-- Si render_url aún no existe (migración 007):
ALTER TABLE clients ADD COLUMN IF NOT EXISTS render_url TEXT;

CREATE INDEX IF NOT EXISTS idx_clients_render_url ON clients(render_url)
  WHERE render_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active);

-- Opcional: recargar caché del API (Supabase suele hacerlo solo en ~1 min)
NOTIFY pgrst, 'reload schema';
