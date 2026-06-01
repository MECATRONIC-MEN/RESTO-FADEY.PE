ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_license_id_fkey;

ALTER TABLE clients
  ADD CONSTRAINT clients_license_id_fkey
  FOREIGN KEY (license_id) REFERENCES licenses(id) ON DELETE SET NULL;
