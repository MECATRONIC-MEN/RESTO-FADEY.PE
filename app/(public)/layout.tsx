import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { PwaInstallTracker } from '@/components/PwaInstallTracker';
import { Loader } from '@/components/Loader';
import { PageBackground } from '@/components/PageBackground';

/** Layout comercial: landing y páginas públicas */
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageBackground />
      <Loader />
      <Navbar />
      <main className="relative z-0 w-full max-w-full overflow-x-hidden">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <PwaInstallTracker />
    </>
  );
}
