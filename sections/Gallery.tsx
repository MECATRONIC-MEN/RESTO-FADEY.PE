'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { GALLERY } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function Gallery() {
  return (
    <section id="galeria" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Galería"
          title="Conoce el sistema en acción"
          highlightLast="en acción"
          subtitle="Capturas reales del panel, ventas, mesas e indicadores de Resto-FADEY."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {GALLERY.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${item.gradient} ${index === 0 ? 'md:col-span-2' : ''}`}
            >
              <div
                className={`relative overflow-hidden bg-white ${index === 0 ? 'aspect-[21/9]' : 'aspect-video'}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes={
                    index === 0
                      ? '(max-width: 768px) 100vw, 1280px'
                      : '(max-width: 768px) 100vw, 50vw'
                  }
                />
              </div>
              <div className="border-t border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
