'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
      )}
    >
      <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-14">
        <Logo size="md" />

        <motion.div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-mist transition-colors hover:text-brand-cyan"
            >
              {link.label}
            </a>
          ))}
        </motion.div>

        <motion.div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-brand-mist transition-colors hover:text-brand-cyan"
          >
            Iniciar sesión
          </Link>
          <Button href="/register" variant="secondary" size="sm">
            Registrarse
          </Button>
          <Button href="/demo" variant="primary" size="sm">
            Solicitar Demo
          </Button>
        </motion.div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-white lg:hidden"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass border-t border-white/10 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4 px-4 py-6"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-brand-mist hover:text-brand-cyan"
                >
                  {link.label}
                </motion.a>
              ))}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-300 hover:text-white"
              >
                Iniciar sesión
              </Link>
              <Button href="/register" variant="secondary" className="w-full">
                Registrarse
              </Button>
              <Button href="/demo" variant="primary" className="w-full">
                Solicitar Demo
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
