'use client';

import { useState } from 'react';
import { Lock, Trash2 } from 'lucide-react';

async function verifyLicenseGate(password: string): Promise<boolean> {
  const res = await fetch('/api/licenses/verify-gate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const json = await res.json();
  return res.ok && json.success === true;
}

export function useLicenseAdminGate() {
  const [renderKeysUnlocked, setRenderKeysUnlocked] = useState(false);

  async function promptAndUnlockRenderKeys() {
    const password = window.prompt('Ingrese la clave para ver las llaves Render:');
    if (!password) return;
    const ok = await verifyLicenseGate(password);
    if (!ok) {
      alert('Clave incorrecta');
      return;
    }
    setRenderKeysUnlocked(true);
  }

  async function promptForDelete(licenseLabel: string): Promise<string | null> {
    if (
      !window.confirm(
        `¿Eliminar la licencia de "${licenseLabel}"?\n\nEsta acción no se puede deshacer.`
      )
    ) {
      return null;
    }
    const password = window.prompt('Ingrese la clave de administración para eliminar:');
    if (!password) return null;
    const ok = await verifyLicenseGate(password);
    if (!ok) {
      alert('Clave incorrecta');
      return null;
    }
    return password;
  }

  return {
    renderKeysUnlocked,
    promptAndUnlockRenderKeys,
    promptForDelete,
  };
}

export function LicenseRenderKeysAccessButton({
  unlocked,
  onUnlock,
}: {
  unlocked: boolean;
  onUnlock: () => void;
}) {
  if (unlocked) return null;

  return (
    <button
      type="button"
      onClick={onUnlock}
      className="flex items-center gap-2 rounded-lg border border-brand-cyan/25 bg-white/5 px-4 py-2 text-sm text-brand-mist transition-colors hover:border-brand-cyan/40 hover:text-brand-soft"
    >
      <Lock className="h-4 w-4 text-brand-cyan" />
      Acceder a llaves Render
    </button>
  );
}

export async function confirmDeleteLicense(label: string): Promise<boolean> {
  return window.confirm(
    `¿Eliminar la licencia de "${label}"?\n\nEsta acción no se puede deshacer.`
  );
}

export function LicenseDeleteButton({
  label,
  promptForDelete,
  onDelete,
  showLabel = false,
  requireGate = false,
}: {
  label: string;
  /** Si requireGate es false, puede omitirse */
  promptForDelete?: (licenseLabel: string) => Promise<string | null>;
  onDelete: (password?: string) => Promise<void>;
  showLabel?: boolean;
  requireGate?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      if (requireGate && promptForDelete) {
        const password = await promptForDelete(label);
        if (!password) return;
        await onDelete(password);
        return;
      }
      const ok = await confirmDeleteLicense(label);
      if (!ok) return;
      await onDelete();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'No se pudo eliminar la licencia');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={handleClick}
      className={
        showLabel
          ? 'inline-flex items-center gap-1.5 rounded-lg border border-red-400/30 px-2.5 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-400/10 disabled:opacity-50'
          : 'rounded-lg p-2 text-red-300 transition-colors hover:bg-red-400/10 disabled:opacity-50'
      }
      aria-label={`Eliminar licencia de ${label}`}
      title="Eliminar licencia"
    >
      <Trash2 className="h-4 w-4 shrink-0" />
      {showLabel && (busy ? 'Eliminando…' : 'Eliminar')}
    </button>
  );
}
