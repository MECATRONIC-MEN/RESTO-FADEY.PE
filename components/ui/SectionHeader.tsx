'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  highlightLast?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  highlightLast,
}: SectionHeaderProps) {
  const parts = highlightLast ? title.split(highlightLast) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={centered ? 'mx-auto max-w-3xl text-center' : ''}
    >
      {badge && (
        <span className="badge-tech mb-4 px-4 py-1.5 text-sm">
          {badge}
        </span>
      )}
      <h2 className="section-title text-balance">
        {parts ? (
          <>
            {parts[0]}
            <span className="gradient-text">{highlightLast}</span>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && <p className={`section-subtitle ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>}
    </motion.div>
  );
}
