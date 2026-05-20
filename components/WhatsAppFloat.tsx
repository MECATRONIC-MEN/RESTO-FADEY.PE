'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';

export function WhatsAppFloat() {
  const [showTip, setShowTip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTip(true), 4000);
    const t2 = setTimeout(() => setShowTip(false), 12000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showTip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="relative max-w-[220px] rounded-xl border border-brand-green/30 bg-brand-navy/95 px-4 py-3 text-sm text-brand-soft shadow-lg backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="absolute right-2 top-2 text-brand-slate hover:text-brand-soft"
              aria-label="Cerrar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="pr-5 font-medium">¿Listo para modernizar tu restaurante?</p>
            <p className="mt-1 text-xs text-brand-mist">Escríbenos — respondemos rápido.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-emerald-500 text-white shadow-glow-green"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={28} fill="currentColor" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-brand-green" />
        </span>
      </motion.a>
    </div>
  );
}
