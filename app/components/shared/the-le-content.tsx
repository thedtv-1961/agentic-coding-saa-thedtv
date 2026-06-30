"use client";

// Static presentational content for Thể Lệ SAA 2025 — dark theme v2
// Text content sourced from MoMorph node tree (screenId: b1Filzi9i6)

import Image from "next/image";
import { useTranslations } from "next-intl";

// icon-*.png = circular icon only (no embedded text); label rendered separately per Figma spec
const COLLECTION_BADGES = [
  { name: "REVIVAL", src: "/images/the-le/icon-revival.png" },
  { name: "TOUCH OF LIGHT", src: "/images/the-le/icon-touch-of-light.png" },
  { name: "STAY GOLD", src: "/images/the-le/icon-stay-gold.png" },
  { name: "FLOW TO HORIZON", src: "/images/the-le/icon-flow-to-horizon.png" },
  { name: "BEYOND THE BOUNDARY", src: "/images/the-le/icon-beyond-the-boundary.png" },
  { name: "ROOT FURTHER", src: "/images/the-le/icon-root-further.png" },
] as const;

export default function TheLEContent() {
  const t = useTranslations("the_le");

  const HERO_BADGES = [
    {
      name: "New Hero",
      src: "/images/the-le/new-hero.png",
      threshold: t("hero_new_threshold"),
      desc: t("hero_new_desc"),
    },
    {
      name: "Rising Hero",
      src: "/images/the-le/rising-hero.png",
      threshold: t("hero_rising_threshold"),
      desc: t("hero_rising_desc"),
    },
    {
      name: "Super Hero",
      src: "/images/the-le/super-hero.png",
      threshold: t("hero_super_threshold"),
      desc: t("hero_super_desc"),
    },
    {
      name: "Legend Hero",
      src: "/images/the-le/legend-hero.png",
      threshold: t("hero_legend_threshold"),
      desc: t("hero_legend_desc"),
    },
  ];

  return (
    <div className="px-10 pt-6 pb-4 space-y-6 text-white">
      {/* Title */}
      <h1 className="text-3xl font-bold text-white">{t("title")}</h1>

      {/* Section 1: Người nhận Kudos */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wide text-[#FFEA9E]">
          {t("section1_title")}
        </h2>
        <p className="text-sm text-white/80 leading-relaxed">
          {t("section1_body")}
        </p>
        <div className="space-y-3">
          {HERO_BADGES.map((badge) => (
            <div key={badge.name} className="flex items-start gap-3">
              <Image
                src={badge.src}
                alt={badge.name}
                width={120}
                height={32}
                className="shrink-0 mt-0.5 object-contain"
              />
              <div>
                <p className="text-xs font-medium text-white/90">{badge.threshold}</p>
                <p className="text-xs text-white/60 leading-relaxed mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Người gửi Kudos */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wide text-[#FFEA9E]">
          {t("section2_title")}
        </h2>
        <p className="text-sm text-white/80 leading-relaxed">
          {t("section2_body1")}
        </p>

        {/* 3×2 badge grid */}
        {/* 3×2 grid — icon 64×64, label Montserrat 700 12px per Figma spec */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-3">
          {COLLECTION_BADGES.map((badge) => (
            <div key={badge.name} className="flex flex-col items-center gap-2">
              <Image
                src={badge.src}
                alt={badge.name}
                width={64}
                height={64}
                className="object-contain rounded-full"
              />
              <p className="text-[12px] font-bold text-white text-center leading-4 tracking-[0.5px]">
                {badge.name}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/60 leading-relaxed">
          {t("section2_body2")}
        </p>
      </section>

      {/* Section 3: Kudos Quốc Dân */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wide text-[#FFEA9E]">
          {t("section3_title")}
        </h2>
        <p className="text-sm text-white/80 leading-relaxed">
          {t("section3_body")}
        </p>
      </section>

      {/* Bottom spacer for fixed footer */}
      <div className="h-2" />
    </div>
  );
}
