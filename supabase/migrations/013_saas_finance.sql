-- Finanzas del negocio Resto Fadey (backoffice SaaS — no módulos POS)

CREATE TABLE IF NOT EXISTS saas_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  email TEXT,
  pay_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  pay_day_of_month INT CHECK (pay_day_of_month IS NULL OR (pay_day_of_month >= 1 AND pay_day_of_month <= 28)),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saas_staff_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES saas_staff(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saas_tax_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_type TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  period_year INT NOT NULL,
  period_month INT NOT NULL CHECK (period_month >= 1 AND period_month <= 12),
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saas_staff_payments_due ON saas_staff_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_saas_staff_payments_staff ON saas_staff_payments(staff_id);
CREATE INDEX IF NOT EXISTS idx_saas_tax_payments_due ON saas_tax_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_saas_tax_payments_period ON saas_tax_payments(period_year, period_month);

ALTER TABLE saas_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_staff_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_tax_payments ENABLE ROW LEVEL SECURITY;
