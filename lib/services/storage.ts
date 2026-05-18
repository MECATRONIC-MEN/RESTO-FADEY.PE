import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured, SUPABASE_STORAGE_BUCKETS } from '@/lib/supabase/config';

/** Sube voucher a Supabase Storage y devuelve URL pública */
export async function uploadVoucher(
  clientId: string,
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const db = getSupabaseAdmin()!;
  const path = `${clientId}/${Date.now()}-${filename}`;

  const { error } = await db.storage.from(SUPABASE_STORAGE_BUCKETS.vouchers).upload(path, file, {
    contentType,
    upsert: false,
  });

  if (error) {
    console.error('uploadVoucher', error);
    return null;
  }

  const { data } = db.storage.from(SUPABASE_STORAGE_BUCKETS.vouchers).getPublicUrl(path);
  return data.publicUrl;
}
