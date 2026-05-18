'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { DEMO_CLIENT_ID } from '@/lib/demo';

type HealthData = {
  config: {
    persistenceReady: boolean;
    warning: string | null;
    apiSecret: boolean;
    supabaseServiceRole: boolean;
  };
  demoClientId: string;
  payments: { count: number; latest: { id: string; status: string; hasVoucher: boolean } | null };
  checklist: { id: string; ok: boolean; label: string }[];
};

export function IntegrationDiagnostics() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      const json = await res.json();
      if (json.success) setData(json.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading && !data) return null;
  if (!data) return null;

  const hasIssues = data.checklist.some((c) => !c.ok) || data.config.warning;

  if (!hasIssues) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Integración lista · {data.payments.count} pago(s) en el sistema
        <button type="button" onClick={load} className="ml-auto text-xs underline">
          Verificar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
        <div className="flex-1 text-sm">
          <p className="font-medium text-amber-100">Revisar integración POS</p>
          {data.config.warning && (
            <p className="mt-1 text-amber-200/90">{data.config.warning}</p>
          )}
          <ul className="mt-2 space-y-1 text-amber-200/80">
            {data.checklist.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                {item.ok ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border border-amber-400" />
                )}
                {item.label}
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-xs text-brand-cyan">
            clientId demo: {DEMO_CLIENT_ID}
          </p>
          {data.payments.latest && (
            <p className="mt-1 text-xs">
              Último pago: {data.payments.latest.id} · voucher:{' '}
              {data.payments.latest.hasVoucher ? 'sí' : 'no enviado'}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-lg p-2 text-amber-200 hover:bg-amber-400/10"
          aria-label="Actualizar diagnóstico"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
