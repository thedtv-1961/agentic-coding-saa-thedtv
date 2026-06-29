import { createClient } from "@/utils/supabase/server";
import Header from "@/app/components/shared/header";
import Footer from "@/app/components/shared/footer";
import AwardsHero from "@/app/components/awards/awards-hero";
import AwardsDetailList from "@/app/components/awards/awards-detail-list";
import AwardsNav from "@/app/components/awards/awards-nav";
import KudosSection from "@/app/components/home/kudos-section";
import type { Award, GroupedAward } from "@/types/awards";
import { nameToSlug } from "@/types/awards";

export default async function AwardsPage() {
  const supabase = await createClient();
  const { data: awards } = await supabase
    .from("awards")
    .select(`
      id, category_id, number_of_winners, winner_unit, prize_value, is_active,
      award_categories!awards_category_id_fkey ( id, name, title, description, content, image_url, is_active )
    `)
    .eq("is_active", true)
    .order("category_id")
    .returns<Award[]>();

  // Group by category_id → 1 card per category (e.g. Signature 2025 has 2 prize tiers)
  const grouped: GroupedAward[] = Array.from(
    (awards ?? []).reduce<Map<number, GroupedAward>>((map, award) => {
      const key = award.category_id;
      if (!map.has(key)) {
        map.set(key, { category: award.award_categories, items: [] });
      }
      map.get(key)!.items.push(award);
      return map;
    }, new Map()).values()
  );

  const navItems = grouped.map((g) => ({
    label: g.category.name,
    slug: nameToSlug(g.category.name),
  }));

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <AwardsHero />

      {/* Main content */}
      <div className="bg-zinc-950 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile sticky nav */}
          <div className="md:hidden sticky top-16 z-20 bg-zinc-950 py-3 mb-10 -mx-6 px-6 border-b border-white/10">
            <AwardsNav navItems={navItems} mobile />
          </div>

          {/* Two-column layout */}
          <div className="flex gap-12 items-start">
            {/* Desktop sticky sidebar */}
            <aside className="hidden md:block w-52 shrink-0 sticky top-24 self-start">
              <AwardsNav navItems={navItems} />
            </aside>

            {/* Award detail cards */}
            <div className="flex-1 min-w-0">
              <AwardsDetailList grouped={grouped} />
            </div>
          </div>
        </div>
      </div>

      <KudosSection />
      <Footer />
    </main>
  );
}
