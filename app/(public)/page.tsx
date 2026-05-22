import { Hero } from '@/sections/Hero';
import { Metrics } from '@/sections/Metrics';
import { ModuleExplorerSection } from '@/sections/ModuleExplorerSection';
import { AIPremium } from '@/sections/AIPremium';
import { VideoDemo } from '@/sections/VideoDemo';
import { Benefits } from '@/sections/Benefits';
import { Pricing } from '@/sections/Pricing';
import { Testimonials } from '@/sections/Testimonials';
import { FAQ } from '@/sections/FAQ';
import { CTA } from '@/sections/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Metrics />
      <ModuleExplorerSection />
      <AIPremium />
      <Benefits />
      <VideoDemo />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
