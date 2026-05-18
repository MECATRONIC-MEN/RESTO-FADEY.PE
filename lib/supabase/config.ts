/** Cliente público (browser) */
export function hasSupabasePublicConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Escrituras servidor (API, pagos POS).
 * Requiere SERVICE_ROLE — con solo ANON_KEY los inserts fallan por RLS.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabaseConfigDiagnostics() {
  const url = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const anon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const apiSecret = Boolean(process.env.API_SECRET_KEY || process.env.POS_API_KEY);
  const posUrl = Boolean(process.env.NEXT_PUBLIC_POS_URL);

  return {
    supabaseUrl: url,
    supabaseServiceRole: serviceRole,
    supabaseAnon: anon,
    persistenceReady: url && serviceRole,
    warning:
      url && !serviceRole && anon
        ? 'Tienes ANON_KEY pero falta SUPABASE_SERVICE_ROLE_KEY: los pagos del POS NO se guardan.'
        : !url
          ? 'Sin Supabase: los pagos solo existen en memoria y se pierden en Vercel.'
          : null,
    apiSecret,
    posUrl,
  };
}

export const SUPABASE_STORAGE_BUCKETS = {
  vouchers: 'vouchers',
  media: 'media',
} as const;
