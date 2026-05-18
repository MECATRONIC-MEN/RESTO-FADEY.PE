'use client';

import { motion } from 'framer-motion';
import { GALLERY } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HeroPremiumComposition } from '@/components/HeroPremiumComposition';
import type { HeroCompositionId } from '@/lib/hero-compositions';

export function Gallery() {
  return (
    <section id="galeria" className="section-padding">
      <motion.div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Galería"
          title="Conoce el sistema en acción"
          highlightLast="en acción"
          subtitle="Composiciones premium del panel: ventas, cocina, inventario, facturación y control total."
        />

        <motion.div className="mt-16 grid gap-8 md:grid-cols-2">
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
                className={`relative overflow-hidden bg-[#060d18] ${index === 0 ? 'aspect-[21/9]' : 'aspect-video'}`}
              >
                <HeroPremiumComposition
                  compositionId={item.image as HeroCompositionId}
                  animate={false}
                  className="transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="border-t border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
