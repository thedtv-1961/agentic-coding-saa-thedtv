import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function AwardsHero() {
  const t = await getTranslations("awards");

  return (
    <section className="relative overflow-hidden">
      {/* Background image — fills right side */}
      <div className="absolute inset-y-0 right-0 w-full  pointer-events-none">
        <Image
          src="/images/homepage/keyvisual.png"
          alt=""
          fill
          className="object-cover object-left"
          priority
          aria-hidden="true"
        />
      </div>

      {/* Left content — bounded within max-w-7xl container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-0 pt-32">
        <div className="flex flex-col gap-4  pb-36">
          <Image
            src="/images/homepage/root-further.png"
            alt="Root Further"
            width={338}
            height={150}
            priority
          />
        </div>
        <p className="text-white/80 text-sm md:text-base font-semibold tracking-widest capitalize text-center">
          {t("hero_subtitle")}
        </p>
        <p className="text-[#FFEA9E] text-2xl md:text-4xl font-black tracking-wide leading-tight text-center pb-0">
          {t("section_title")}
        </p>
      </div>
    </section>
  );
}
