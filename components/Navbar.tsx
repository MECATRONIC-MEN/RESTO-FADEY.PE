'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass-nav border-b border-white/10 py-2.5 shadow-lg shadow-brand-deep/20'
          : 'border-b border-transparent bg-transparent py-4'
      )}
    >
      <nav className="mx-auto flex w-full min-w-0 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 xl:px-14">
        <Logo size="md" className="min-w-0 shrink" />

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-brand-mist transition-colors hover:text-brand-cyan after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand-cyan after:transition-all hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-brand-mist transition-colors hover:text-brand-soft"
          >
            Iniciar sesión
          </Link>
          <Button href="/register" variant="secondary" size="sm">
            Registrarse
          </Button>
          <Button href="/demo" variant="premium" size="sm" className="shadow-glow-gold">
            <Calendar className="h-4 w-4" />
            Agendar Demo
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg border border-white/10 bg-white/5 p-2 text-white lg:hidden"
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
            className="glass-nav border-t border-white/10 lg:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-brand-mist hover:text-brand-cyan"
                >
                  {link.label}
                </motion.a>
              ))}
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-brand-mist">
                Iniciar sesión
              </Link>
              <Button href="/demo" variant="premium" className="w-full">
                <Calendar className="h-4 w-4" />
                Agendar Demo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
