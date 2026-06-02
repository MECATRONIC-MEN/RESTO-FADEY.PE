-- Calificaciones de visitantes (landing / testimonios)
CREATE TABLE IF NOT EXISTS visitor_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  restaurant TEXT NOT NULL,
  role TEXT NOT NULL,
  comment TEXT NOT NULL,
  result TEXT,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visitor_ratings_status_created
  ON visitor_ratings (status, created_at DESC);
