import { createClient } from "@/utils/supabase/server";
import Header from "@/app/components/shared/header";
import Footer from "@/app/components/shared/footer";
import WidgetButton from "@/app/components/shared/widget-button";
import AwardsHero from "@/app/components/awards/awards-hero";
import AwardsSectionTitle from "@/app/components/awards/awards-section-title";
import AwardsDetailList from "@/app/components/awards/awards-detail-list";
import AwardsNav from "@/app/components/awards/awards-nav";
import KudosSection from "@/app/components/home/kudos-section";
import type { Award } from "@/types/awards";
import { CATEGORY_ORDER } from "@/types/awards";

export default async function AwardsPage() {
  const supabase = await createClient();
  const { data: awards } = await supabase
    .from("awards")
    .select("id,category,title,description,award_value,recipient_count")
    .eq("year", 2025)
    .returns<Award[]>();

  const sortedAwards = (awards ?? [])
    .slice()
    .sort(
      (a, b) =>
        (CATEGORY_ORDER[a.category] ?? 99) -
        (CATEGORY_ORDER[b.category] ?? 99),
    );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <AwardsHero />

      {/* Main content */}
      <div className="bg-zinc-950 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AwardsSectionTitle />

          {/* Mobile sticky nav */}
          <div className="md:hidden sticky top-16 z-20 bg-zinc-950 py-3 mb-10 -mx-6 px-6 border-b border-white/10">
            <AwardsNav mobile />
          </div>

          {/* Two-column layout */}
          <div className="flex gap-12 items-start">
            {/* Desktop sticky sidebar */}
            <aside className="hidden md:block w-52 shrink-0 sticky top-24 self-start">
              <AwardsNav />
            </aside>

            {/* Award detail cards */}
            <div className="flex-1 min-w-0">
              <AwardsDetailList awards={sortedAwards} />
            </div>
          </div>
        </div>
      </div>

      <KudosSection />
      <Footer />
      <WidgetButton />
    </main>
  );
}
