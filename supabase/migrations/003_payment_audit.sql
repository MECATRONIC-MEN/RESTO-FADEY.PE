-- Auditoría y sincronización POS
ALTER TABLE payments ADD COLUMN IF NOT EXISTS pos_notified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_payments_client_status ON payments(client_id, status);
