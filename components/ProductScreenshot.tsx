'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProductScreenshotProps {
  src: string;
  alt: string;
  priority?: boolean;
  caption?: string;
}

export function ProductScreenshot({
  src,
  alt,
  priority = false,
  caption = 'Resto-FADEY — Panel en vivo',
}: ProductScreenshotProps) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
    >
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-brand-cyan/25 via-brand-blue/15 to-brand-gold/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-xs font-medium text-gray-500">{caption}</span>
        </div>
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={750}
          priority={priority}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </motion.div>
  );
}
