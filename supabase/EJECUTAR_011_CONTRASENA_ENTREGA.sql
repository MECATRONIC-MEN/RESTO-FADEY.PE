-- Ejecutar en Supabase → SQL Editor si la columna aún no existe
ALTER TABLE users ADD COLUMN IF NOT EXISTS portal_delivery_password TEXT;

COMMENT ON COLUMN users.portal_delivery_password IS
  'Última contraseña generada para entregar al restaurante. Solo lectura admin.';
