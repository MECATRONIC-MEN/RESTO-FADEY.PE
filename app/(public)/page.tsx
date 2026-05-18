import { Hero } from '@/sections/Hero';
import { Features } from '@/sections/Features';
import { Benefits } from '@/sections/Benefits';
import { Gallery } from '@/sections/Gallery';
import { Pricing } from '@/sections/Pricing';
import { Testimonials } from '@/sections/Testimonials';
import { FAQ } from '@/sections/FAQ';
import { Contact } from '@/sections/Contact';
import { CTA } from '@/sections/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Benefits />
      <Gallery />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <CTA />
    </>
  );
}
