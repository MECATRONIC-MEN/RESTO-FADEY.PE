-- Ejecutar en Supabase SQL Editor (antes de eliminar licencias con pagos históricos)
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_client_id_fkey;

ALTER TABLE payments ALTER COLUMN client_id DROP NOT NULL;

ALTER TABLE payments
  ADD CONSTRAINT payments_client_id_fkey
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;
