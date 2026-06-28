import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function AwardsHero() {
  const t = await getTranslations("awards");

  return (
    <section className="relative h-[500px] overflow-hidden bg-[#0d1520]">
      <Image
        src="/images/homepage/keyvisual.png"
        alt="Keyvisual Sun* Annual Award 2025"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center gap-6 px-6">
        <Image
          src="/images/homepage/root-further.png"
          alt="Root Further"
          width={520}
          height={230}
          className="w-auto max-h-40 md:max-h-52"
          priority
        />
        <p className="text-white/80 text-base md:text-lg font-semibold tracking-widest uppercase">
          {t("hero_subtitle")}
        </p>
      </div>
    </section>
  );
}
