-- NO ejecutar el script 012 anterior (mezclaba módulos POS con finanzas SaaS).
-- Si ya lo ejecutaste, corre ESTE script para volver el plan Premium a ["all"].

UPDATE plans
SET modules = '["all"]'::jsonb
WHERE slug = 'premium';

UPDATE licenses
SET modules_enabled = '["all"]'::jsonb
WHERE plan_id IN (SELECT id FROM plans WHERE slug = 'premium');

-- Los controles de impuestos / ganancia / planilla del negocio Resto Fadey
-- viven en el panel admin (Estadísticas), NO en la tabla plans.
