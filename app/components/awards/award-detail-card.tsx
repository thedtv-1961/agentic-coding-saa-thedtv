import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Award } from "@/types/awards";
import { AWARD_META } from "@/types/awards";

interface Props {
  award: Award;
}

export default async function AwardDetailCard({ award }: Props) {
  const t = await getTranslations("awards");
  const meta = AWARD_META[award.category] ?? {
    image: "/images/awards/top-talent.png",
    slug: award.category,
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Award image */}
      <div className="shrink-0 w-full md:w-[280px] aspect-square relative rounded-2xl overflow-hidden border border-[#FFEA9E]/20">
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

      {/* Award content */}
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
          {award.title}
        </h2>
        <p className="text-white/65 text-base leading-relaxed">
          {award.description}
        </p>
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-sm text-white/80">
            <span className="font-semibold text-[#FFEA9E]">{t("quantity_label")}:</span>{" "}
            {award.recipient_count}
          </p>
          <p className="text-sm text-white/80">
            <span className="font-semibold text-[#FFEA9E]">{t("value_label")}:</span>{" "}
            {award.award_value}
          </p>
        </div>
      </div>
    </div>
  );
}
