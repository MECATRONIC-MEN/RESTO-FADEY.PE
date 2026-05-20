'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, MessageCircle } from 'lucide-react';
import { NAV_LINKS, FUTURE_ROUTES, SITE_URL, CONTACT, SOCIAL_LINKS } from '@/lib/constants';
import { Logo } from '@/components/Logo';

const socialIcons = {
  facebook: Facebook,
  messenger: MessageCircle,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative border-t border-brand-cyan/15 bg-gradient-to-b from-white/[0.04] to-brand-deep/40 backdrop-blur-sm"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10 xl:px-14"
      >
        <motion.div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <motion.div>
            <Logo size="md" />
            <p className="mt-4 text-sm text-brand-mist">
              Tecnología que potencia la gestión de tu restaurante. Punto de venta, mesas,
              inventario y reportes en un solo sistema.
            </p>
            <p className="mt-2 font-mono text-sm text-brand-green">restofadey.pe</p>
          </motion.div>

          <motion.div>
            <h3 className="font-semibold text-white">Enlaces rápidos</h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-brand-mist transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div>
            <h3 className="font-semibold text-white">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="text-brand-mist transition-colors hover:text-white">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.phoneTel}`} className="text-brand-mist transition-colors hover:text-white">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={CONTACT.messengerUrl} target="_blank" rel="noopener noreferrer" className="text-brand-mist transition-colors hover:text-white">
                  Messenger: {CONTACT.messengerLabel}
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div>
            <h3 className="font-semibold text-white">Más</h3>
            <ul className="mt-4 space-y-2">
              {FUTURE_ROUTES.map((route) => (
                <li key={route.href}>
                  <Link href={route.href} className="text-sm text-brand-mist transition-colors hover:text-white">
                    {route.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/terminos" className="text-sm text-brand-mist transition-colors hover:text-white">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-sm text-brand-mist transition-colors hover:text-white">
                  Política de privacidad
                </Link>
              </li>
            </ul>
            <motion.div className="mt-6 flex gap-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <a key={social.icon} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="glass flex h-10 w-10 items-center justify-center rounded-lg text-brand-mist transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan hover:text-white">
                    <Icon size={20} />
                  </a>
                );
              })}
            </motion.div>
            <p className="mt-4 text-sm text-gray-500">Compatible con SUNAT</p>
          </motion.div>
        </motion.div>

        <motion.div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">© {currentYear} Resto Fadey. Todos los derechos reservados.</p>
          <p className="text-sm text-gray-500">
            <a href={SITE_URL} className="transition-colors hover:text-brand-green">
              {SITE_URL.replace('https://', '')}
            </a>
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
