-- Conexión automática POS Render → panel Clientes / Restaurantes

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS api_key TEXT,
  ADD COLUMN IF NOT EXISTS system_version TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS pos_connection_status TEXT DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS pos_last_seen_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_clients_render_url ON clients(render_url)
  WHERE render_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active);
