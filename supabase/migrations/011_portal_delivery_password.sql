-- Contraseña de entrega al cliente (visible solo en panel admin; el hash sigue en password_hash)
ALTER TABLE users ADD COLUMN IF NOT EXISTS portal_delivery_password TEXT;

COMMENT ON COLUMN users.portal_delivery_password IS
  'Última contraseña generada para entregar al restaurante. Solo lectura admin.';
