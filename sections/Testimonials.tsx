'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function Testimonials() {
  return (
    <section id="testimonios" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Testimonios"
          title="Restaurantes que confían en nosotros"
          subtitle="Muchos negocios en Perú ya modernizaron su operación con Resto Fadey."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card relative p-6"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-brand-cyan/25" />
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">&ldquo;{testimonial.comment}&rdquo;</p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-brand-green">{testimonial.restaurant}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
