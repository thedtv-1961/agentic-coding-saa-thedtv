import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Award } from "@/types/awards";
import { AWARD_META } from "@/types/awards";

interface Props {
  award: Award;
}

export default async function AwardCard({ award }: Props) {
  const t = await getTranslations("home");
  const meta = AWARD_META[award.category] ?? {
    image: "/images/awards/placeholder.png",
    slug: award.category,
  };

  return (
    <Link
      href={`/awards#${meta.slug}`}
      className="group bg-zinc-900 rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-300"
    >
      {/* Award image placeholder — replace with real images when available */}
      <div className="relative aspect-square bg-gradient-to-br from-yellow-900/20 to-zinc-800 flex items-center justify-center">
        <svg
          className="w-20 h-20 text-yellow-400/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={0.75}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-white font-bold text-lg leading-snug">
          {award.title}
        </h3>
        <p className="text-white/55 text-sm line-clamp-2 flex-1">
          {award.description}
        </p>
        <span className="text-yellow-400 text-sm font-semibold group-hover:underline">
          {t("award_detail")} →
        </span>
      </div>
    </Link>
  );
}
