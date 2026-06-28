import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function RootFurtherSection() {
  const t = await getTranslations("home");

  return (
    <section className="bg-black py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-10">
          <Image
            src="/images/homepage/root-further-center.png"
            alt="Root Further"
            width={290}
            height={134}
            className="mx-auto"
          />
        </div>

        <div className="flex flex-col gap-3 text-left mb-6">
          <p className="text-white/70 text-base leading-relaxed">{t("root_further_body_1")}</p>
          <p className="text-white/70 text-base leading-relaxed">{t("root_further_body_2")}</p>
          <p className="text-white/70 text-base leading-relaxed">{t("root_further_body_3")}</p>
        </div>

        <blockquote className="text-white text-xl md:text-2xl italic font-semibold">
          &ldquo;{t("root_further_quote")}&rdquo;
        </blockquote>
        <p className="text-white/60 text-sm mt-2">{t("root_further_quote_note")}</p>

        <div className="flex flex-col gap-3 text-left mt-6">
          <p className="text-white/70 text-base leading-relaxed">{t("root_further_body_4")}</p>
          <p className="text-white/70 text-base leading-relaxed">{t("root_further_body_5")}</p>
        </div>
      </div>
    </section>
  );
}
