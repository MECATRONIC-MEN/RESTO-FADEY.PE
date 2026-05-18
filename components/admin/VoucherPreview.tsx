'use client';

import Image from 'next/image';

type VoucherPreviewProps = {
  url: string;
  alt?: string;
};

/** Vouchers del POS (URL absoluta) o rutas locales */
export function VoucherPreview({ url, alt = 'Comprobante de pago' }: VoucherPreviewProps) {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={trimmed}
        alt={alt}
        className="max-h-80 w-full rounded-lg border border-white/10 object-contain bg-black/40"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className="relative aspect-video min-h-48 overflow-hidden rounded-lg border border-white/10">
      <Image src={trimmed} alt={alt} fill className="object-contain bg-black/40" unoptimized />
    </div>
  );
}
