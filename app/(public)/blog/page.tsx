import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Noticias, tips y novedades sobre gestión de restaurantes con Resto Fadey.',
};

const posts = [
  {
    slug: 'boletas-electronicas-sunat',
    title: 'Guía completa de boletas electrónicas SUNAT para restaurantes',
    excerpt: 'Todo lo que necesitas saber para emitir comprobantes electrónicos correctamente.',
    date: '15 Mar 2026',
  },
  {
    slug: 'optimizar-cocina-restaurante',
    title: '5 tips para optimizar tu cocina y reducir tiempos de espera',
    excerpt: 'Estrategias probadas para mejorar la eficiencia en cocina.',
    date: '10 Mar 2026',
  },
  {
    slug: 'delivery-restaurantes-peru',
    title: 'Cómo gestionar delivery en restaurantes peruanos',
    excerpt: 'Herramientas y buenas prácticas para el delivery exitoso.',
    date: '5 Mar 2026',
  },
];

export default function BlogPage() {
  return (
    <section className="section-padding min-h-screen pt-32 pb-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Blog <span className="gradient-text">Resto Fadey</span>
          </h1>
          <p className="mt-4 text-gray-400">Tips y novedades para tu restaurante.</p>
        </div>

        <div className="mt-12 space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="glass-card group p-6 transition-all hover:border-brand-blue/30"
            >
              <p className="text-sm text-brand-blue">{post.date}</p>
              <h2 className="mt-2 font-display text-xl font-semibold group-hover:text-brand-blue transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-400">{post.excerpt}</p>
              <span className="mt-4 inline-block text-sm text-brand-green">Próximamente →</span>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
