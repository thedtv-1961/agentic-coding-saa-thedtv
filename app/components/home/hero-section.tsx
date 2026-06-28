import { getTranslations } from "next-intl/server";
import Link from "next/link";
import CountdownTimer from "@/app/components/countdown/countdown-timer";

const TARGET_DATE = "2026-12-20T00:00:00+07:00";

export default async function HeroSection() {
  const t = await getTranslations("home");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/countdown-bg.jpg')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-8 pt-20">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-none">
          {t("hero_title")}
        </h1>

        <CountdownTimer targetDate={TARGET_DATE} />

        <div className="flex flex-col items-center gap-1 text-white/80 text-sm md:text-base">
          <p>
            <span className="font-semibold">{t("event_date_label")}</span>{" "}
            {t("event_date_value")}
          </p>
          <p>
            <span className="font-semibold">{t("event_venue_label")}</span>{" "}
            {t("event_venue_value")}
          </p>
          <p className="text-white/60 text-xs mt-1">{t("event_livestream")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/awards"
            className="px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-bold text-sm tracking-wider hover:bg-yellow-400 hover:text-black transition-colors rounded"
          >
            {t("cta_awards")}
          </Link>
          <Link
            href="/kudos"
            className="px-8 py-3 border-2 border-white text-white font-bold text-sm tracking-wider hover:bg-white hover:text-black transition-colors rounded"
          >
            {t("cta_kudos")}
          </Link>
        </div>
      </div>
    </section>
  );
}
