-- Seed inicial — mismas credenciales demo que lib/auth/users.ts
-- Admin@2026 / Cliente@2026

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

-- password: Admin@2026
INSERT INTO users (id, email, password_hash, name, role, client_id) VALUES
  ('d0000001-0000-4000-8000-000000000001', 'admin@restofadey.pe',
   '$2b$10$ZDhAIVgqbjWZ5ln2b5t9ze7/u5x8ywGWtopz7SqiJctUO/ckJA1hK', 'Administrador Maestro', 'master_admin', NULL),
  ('d0000001-0000-4000-8000-000000000002', 'cliente@restofadey.pe',
   '$2b$10$FBhxRxnX.k/O0nAlwKh3I.2apfZU4yoBPb0PFx2GLjp9m1PnJxBhe', 'Restaurante Demo', 'cliente',
   'b0000001-0000-4000-8000-000000000001')
ON CONFLICT (email) DO NOTHING;
