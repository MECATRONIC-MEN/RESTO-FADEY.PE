-- =============================================================================
-- RESTO FADEY — Ejecutar TODO este archivo UNA sola vez en Supabase SQL Editor
-- Resultado esperado: "Success. No rows returned" (es normal en CREATE TABLE)
-- Luego revisa Table Editor: deben aparecer plans, clients, payments, users, etc.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------- 001: Esquema ----------
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PEN',
  modules JSONB NOT NULL DEFAULT '[]',
  limits JSONB NOT NULL DEFAULT '{}',
  highlighted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  ruc TEXT,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  plan_id UUID REFERENCES plans(id),
  pos_device_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('master_admin', 'cliente', 'observador')),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL CHECK (status IN ('activo', 'suspendido', 'vencido', 'prueba')),
  license_key TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  modules_enabled JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE clients ADD COLUMN IF NOT EXISTS license_id UUID REFERENCES licenses(id);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id),
  client_name TEXT NOT NULL,
  restaurant_name TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PEN',
  method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  voucher_url TEXT,
  voucher_path TEXT,
  reference TEXT,
  period TEXT,
  plan_name TEXT,
  source TEXT NOT NULL DEFAULT 'pos',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_submitted ON payments(submitted_at DESC);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  plan_interest TEXT,
  message TEXT,
  survey JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  discount_percent NUMERIC(5,2),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  plan_ids JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL DEFAULT 'news',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- ---------- 003: Auditoría pagos ----------
ALTER TABLE payments ADD COLUMN IF NOT EXISTS pos_notified_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_payments_client_status ON payments(client_id, status);

-- ---------- 005: Notificaciones admin ----------
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_created
  ON admin_notifications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_unread
  ON admin_notifications (read_at) WHERE read_at IS NULL;

-- ---------- 006: Demos ----------
CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_requests_created ON demo_requests (created_at DESC);

-- ---------- 007: Integración POS ----------
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

-- ---------- 002: Datos demo (admin + cliente) ----------
INSERT INTO plans (id, slug, name, price_monthly, modules, limits, highlighted) VALUES
  ('a0000001-0000-4000-8000-000000000001', 'basico', 'Básico', 150, '["ventas","mesas","sunat"]', '{"usuarios":3}', false),
  ('a0000001-0000-4000-8000-000000000002', 'pro', 'Pro', 200, '["ventas","cocina","delivery","inventario","sunat"]', '{"usuarios":10}', false),
  ('a0000001-0000-4000-8000-000000000003', 'premium', 'Premium', 299, '["all"]', '{"usuarios":"ilimitado"}', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO clients (id, business_name, ruc, contact_name, email, phone, plan_id, pos_device_id) VALUES
  ('b0000001-0000-4000-8000-000000000001', 'Restaurante Demo', '20123456789', 'Restaurante Demo', 'cliente@restofadey.pe', '+51935968198',
   'a0000001-0000-4000-8000-000000000003', 'POS-FADEY-001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO licenses (id, client_id, plan_id, status, license_key, expires_at, modules_enabled) VALUES
  ('c0000001-0000-4000-8000-000000000001', 'b0000001-0000-4000-8000-000000000001',
   'a0000001-0000-4000-8000-000000000003', 'activo', 'RF-CLI001-2026', '2026-12-31T23:59:59Z', '["all"]')
ON CONFLICT (id) DO NOTHING;

UPDATE clients SET license_id = 'c0000001-0000-4000-8000-000000000001'
WHERE id = 'b0000001-0000-4000-8000-000000000001';

INSERT INTO users (id, email, password_hash, name, role, client_id) VALUES
  ('d0000001-0000-4000-8000-000000000001', 'admin@restofadey.pe',
   '$2b$10$ZDhAIVgqbjWZ5ln2b5t9ze7/u5x8ywGWtopz7SqiJctUO/ckJA1hK', 'Administrador Maestro', 'master_admin', NULL),
  ('d0000001-0000-4000-8000-000000000002', 'cliente@restofadey.pe',
   '$2b$10$FBhxRxnX.k/O0nAlwKh3I.2apfZU4yoBPb0PFx2GLjp9m1PnJxBhe', 'Restaurante Demo', 'cliente',
   'b0000001-0000-4000-8000-000000000001')
ON CONFLICT (email) DO NOTHING;
