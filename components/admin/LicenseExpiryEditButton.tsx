'use client';

import { CalendarClock } from 'lucide-react';

export function LicenseExpiryEditButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg p-2 text-brand-cyan transition-colors hover:bg-brand-cyan/10"
      aria-label={`Editar vencimiento de ${label}`}
      title="Editar vencimiento"
    >
      <CalendarClock className="h-4 w-4" />
    </button>
  );
}
