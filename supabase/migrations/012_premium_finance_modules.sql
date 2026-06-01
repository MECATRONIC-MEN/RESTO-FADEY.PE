-- Módulos Premium: pagos de impuestos, ganancia total, pago del personal

UPDATE plans
SET modules = '[
  "ventas","cocina","delivery","inventario","sunat","reportes","finanzas","personal",
  "pagos_impuestos","ganancia_total","pago_personal","ia_predictiva","alertas_ia"
]'::jsonb
WHERE slug = 'premium';

UPDATE licenses
SET modules_enabled = '[
  "ventas","cocina","delivery","inventario","sunat","reportes","finanzas","personal",
  "pagos_impuestos","ganancia_total","pago_personal","ia_predictiva","alertas_ia"
]'::jsonb
WHERE plan_id IN (SELECT id FROM plans WHERE slug = 'premium');
