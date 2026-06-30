export const runtime = 'edge';

import { Suspense } from "react";
import Header from "@/app/components/shared/header";
import HeroSection from "@/app/components/home/hero-section";
import RootFurtherSection from "@/app/components/home/root-further-section";
import AwardsSection from "@/app/components/home/awards-section";
import KudosSection from "@/app/components/home/kudos-section";
import Footer from "@/app/components/shared/footer";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <HeroSection />
      <RootFurtherSection />
      <Suspense fallback={<div className="bg-zinc-950 py-20" />}>
        <AwardsSection />
      </Suspense>
      <KudosSection />
      <Footer />
    </main>
  );
}
