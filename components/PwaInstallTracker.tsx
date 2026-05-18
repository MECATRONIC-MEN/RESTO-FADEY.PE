'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'rf_pwa_install_reported';

async function reportPwaInstall(source: 'appinstalled' | 'standalone') {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(STORAGE_KEY)) return;

  try {
    const res = await fetch('/api/notifications/pwa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      }),
    });
    const json = await res.json();
    if (json.success) {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    }
  } catch {
    /* silencioso — no bloquear al usuario */
  }
}

function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** Detecta instalación PWA y avisa al admin */
export function PwaInstallTracker() {
  useEffect(() => {
    if (isStandaloneDisplay()) {
      void reportPwaInstall('standalone');
    }

    const onInstalled = () => {
      void reportPwaInstall('appinstalled');
    };

    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  return null;
}
