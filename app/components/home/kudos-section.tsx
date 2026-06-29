import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export default async function KudosSection() {
  const t = await getTranslations("home");

  return (
    <section id="kudos" className="relative bg-black py-20 px-6 overflow-hidden scroll-mt-16">
      {/* Background image */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/homepage/kudos-banner.png"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: text content */}
        <div className="flex flex-col gap-4">
          <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase">
            {t("kudos_label")}
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            {t("kudos_title")}
          </h2>
          <p className="text-[#FFEA9E] text-xs font-bold tracking-[0.15em] uppercase">
            {t("kudos_new_label")}
          </p>
          <p className="text-white/65 text-base leading-relaxed">
            {t("kudos_body")}
          </p>
          <div>
            <Link
              href="/kudos"
              className="inline-flex px-6 py-3 border border-white/40 text-white text-sm font-bold tracking-wider hover:bg-white/10 transition-colors"
            >
              {t("kudos_detail")} ↗
            </Link>
          </div>
        </div>

        {/* Right: KUDOS logo image from Figma */}
        <div className="flex items-center justify-center md:justify-end">
          <Image
            src="/images/kudos/kudos-logo.png"
            alt="Sun* Kudos"
            width={364}
            height={66}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
