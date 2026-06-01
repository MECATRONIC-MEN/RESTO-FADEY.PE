-- Revertir: impuestos/ganancia/planilla NO son módulos del POS en plans
-- Solo aplica si ejecutaste la migración 012 incorrecta

UPDATE plans SET modules = '["all"]'::jsonb WHERE slug = 'premium';

UPDATE licenses
SET modules_enabled = '["all"]'::jsonb
WHERE plan_id IN (SELECT id FROM plans WHERE slug = 'premium');
