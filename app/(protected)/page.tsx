export const runtime = 'edge';

import Header from "@/app/components/shared/header";
import HeroSection from "@/app/components/home/hero-section";
import RootFurtherSection from "@/app/components/home/root-further-section";
import AwardsSection from "@/app/components/home/awards-section";
import KudosSection from "@/app/components/home/kudos-section";
import Footer from "@/app/components/shared/footer";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <HeroSection />
      <RootFurtherSection />
      <AwardsSection />
      <KudosSection />
      <Footer />
    </main>
  );
}
