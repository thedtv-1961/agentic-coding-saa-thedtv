import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Award } from "@/types/awards";
import { AWARD_META } from "@/types/awards";

interface Props {
  award: Award;
}

export default async function AwardCard({ award }: Props) {
  const t = await getTranslations("home");
  const meta = AWARD_META[award.category] ?? {
    image: "/images/awards/top-talent.png",
    slug: award.category,
  };

  return (
    <Link
      href={`/awards#${meta.slug}`}
      className="group flex flex-col hover:-translate-y-1 transition-transform duration-300"
    >
      {/* Award image: background sphere + category name overlay */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#FFEA9E]/30 shadow-[0_0_8px_0_rgba(250,226,135,0.3)] group-hover:shadow-[0_0_16px_0_rgba(250,226,135,0.5)]">
        <Image
          src="/images/awards/award-background.png"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center z-10 px-[15%] pb-[10%]">
          <Image
            src={meta.image}
            alt={award.title}
            width={443}
            height={71}
            className="w-full h-auto object-contain drop-shadow-[0_0_8px_rgba(250,226,135,0.6)]"
          />
        </div>
      </div>

      {/* Card content */}
      <div className="pt-4 flex flex-col gap-2">
        <h3 className="text-white font-bold text-lg leading-snug">
          {award.title}
        </h3>
        <p className="text-white/55 text-sm line-clamp-2 flex-1">
          {award.description}
        </p>
        <span className="inline-flex items-center gap-1 text-[#FFEA9E] text-sm font-semibold group-hover:underline">
          {t("award_detail")} <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
}
