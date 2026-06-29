import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { GroupedAward } from "@/types/awards";
import { WINNER_UNIT_LABEL } from "@/types/awards";

interface Props {
  grouped: GroupedAward;
  reverse?: boolean;
}

export default async function AwardDetailCard({ grouped, reverse = false }: Props) {
  const t = await getTranslations("awards");
  const { name, title, content, description, image_url } = grouped.category;
  const displayTitle = title || name;
  const displayBody = content || description;
  const multiPrize = grouped.items.length > 1;

  return (
    <div
      className={`flex flex-col gap-8 items-start md:flex-row${reverse ? " md:flex-row-reverse" : ""}`}
    >
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
            src={image_url}
            alt={displayTitle}
            width={443}
            height={71}
            className="w-full h-auto object-contain drop-shadow-[0_0_8px_rgba(250,226,135,0.6)]"
          />
        </div>
      </div>

      {/* Award content */}
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
          {displayTitle}
        </h2>
        <p className="text-white/65 text-base leading-relaxed">
          {displayBody}
        </p>

        <div className="flex flex-col gap-2 mt-2">
          {multiPrize ? (
            grouped.items.map((award) => {
              const unitLabel = award.winner_unit != null ? WINNER_UNIT_LABEL[award.winner_unit] : null;
              return (
                <div key={award.id} className="flex flex-col gap-1">
                  {unitLabel && (
                    <p className="text-sm font-semibold text-[#FFEA9E]">{unitLabel}</p>
                  )}
                  <p className="text-sm text-white/80">
                    <span className="font-semibold text-[#FFEA9E]">{t("quantity_label")}:</span>{" "}
                    {award.number_of_winners} {unitLabel ? `${unitLabel.toLowerCase()}` : ""}
                  </p>
                  <p className="text-sm text-white/80">
                    <span className="font-semibold text-[#FFEA9E]">{t("value_label")}:</span>{" "}
                    {award.prize_value.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              );
            })
          ) : (
            (() => {
              const award = grouped.items[0];
              const unitLabel = award.winner_unit != null ? WINNER_UNIT_LABEL[award.winner_unit] : null;
              return (
                <>
                  <p className="text-sm text-white/80">
                    <span className="font-semibold text-[#FFEA9E]">{t("quantity_label")}:</span>{" "}
                    {award.number_of_winners}
                    {unitLabel ? ` ${unitLabel}` : ""}
                  </p>
                  <p className="text-sm text-white/80">
                    <span className="font-semibold text-[#FFEA9E]">{t("value_label")}:</span>{" "}
                    {award.prize_value.toLocaleString("vi-VN")} VNĐ
                  </p>
                </>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
