import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/app/components/countdown/countdown-timer";


const TARGET_DATE = "2026-12-20T00:00:00+07:00";

export default async function HeroSection() {
  const t = await getTranslations("home");

  return (
    <section className="relative min-h-screen bg-[#0d1520] overflow-hidden">
      {/* Key visual image — right side, absolutely positioned */}
      <div className="absolute inset-y-0 right-0 w-full md:w-3/5 pointer-events-none">
        <Image
          src="/images/countdown-bg.jpg"
          alt=""
          fill
          className="object-cover object-left"
          priority
          aria-hidden="true"
        />
        {/* Gradient mask to blend left edge with background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1520] via-[#0d1520]/60 to-transparent" />
      </div>

      {/* Left content */}
      <div className="relative z-10 flex flex-col gap-8 px-8 md:px-16 lg:px-24 pt-36 pb-20 max-w-2xl">
        {/* Title — ROOT FURTHER image from Figma */}
        <Image
          src="/images/homepage/root-further.png"
          alt="Root Further"
          width={600}
          height={266}
          className="max-w-full w-auto max-h-56 md:max-h-72"
          priority
        />

        {/* Coming soon */}
        <p className="text-white font-semibold text-base">{t("hero_coming_soon")}</p>

        <CountdownTimer targetDate={TARGET_DATE} />

        {/* Event info */}
        <div className="flex flex-col gap-1 text-white/80 text-sm">
          <p>
            <span className="font-semibold">{t("event_date_label")}</span>{" "}
            <span className="font-bold text-[#FFEA9E]">{t("event_date_value")}</span>
            {"   "}
            <span className="font-semibold ml-4">{t("event_venue_label")}</span>{" "}
            <span className="font-bold text-[#FFEA9E]">{t("event_venue_value")}</span>
          </p>
          <p className="text-white/60 text-xs">{t("event_livestream")}</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/awards"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFEA9E] text-black font-bold text-sm tracking-wider hover:bg-[#FFEA9E]/80 transition-colors"
          >
            {t("cta_awards")} <span aria-hidden="true">↗</span>
          </Link>
          <Link
            href="/kudos"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold text-sm tracking-wider hover:bg-white hover:text-black transition-colors"
          >
            {t("cta_kudos")} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
