-- Integración POS Render ↔ panel SaaS (solo pagos y licencias)
-- No modifica tablas existentes; solo columnas opcionales.

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS render_url TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT;

ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS operation_number TEXT,
  ADD COLUMN IF NOT EXISTS admin_name TEXT,
  ADD COLUMN IF NOT EXISTS admin_email TEXT,
  ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_payments_operation_number ON payments(operation_number)
  WHERE operation_number IS NOT NULL;

COMMENT ON COLUMN clients.render_url IS 'URL del POS en Render para notificar aprobación de pago';
COMMENT ON COLUMN clients.payment_status IS 'Último estado de pago conocido (pending/approved/rejected)';
COMMENT ON COLUMN payments.operation_number IS 'Número de operación bancario enviado por el POS';
