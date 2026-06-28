import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import AwardCard from "./award-card";
import type { Award } from "@/types/awards";
import { CATEGORY_ORDER } from "@/types/awards";

export default async function AwardsSection() {
  const [t, supabase] = await Promise.all([
    getTranslations("home"),
    createClient(),
  ]);

  const { data: awards } = await supabase
    .from("awards")
    .select("id,category,title,description")
    .eq("year", 2025)
    .returns<Award[]>();

  return (
    <section className="bg-zinc-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            {t("awards_caption")}
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            {t("awards_title")}
          </h2>
        </div>

        {/* Awards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(awards ?? [])
            .slice()
            .sort((a, b) => (CATEGORY_ORDER[a.category] ?? 99) - (CATEGORY_ORDER[b.category] ?? 99))
            .map((award) => (
              <AwardCard key={award.id} award={award} />
            ))}
        </div>
      </div>
    </section>
  );
}
