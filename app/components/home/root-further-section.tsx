import { getTranslations } from "next-intl/server";

export default async function RootFurtherSection() {
  const t = await getTranslations("home");

  return (
    <section className="relative bg-black py-24 px-6 overflow-hidden">
      {/* Decorative background text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-[14vw] font-black text-white/[0.04] leading-none tracking-tight">
          ROOT
        </span>
        <span className="text-[14vw] font-black text-white/[0.04] leading-none tracking-tight">
          FURTHER
        </span>
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        {/* ROOT FURTHER logo/wordmark */}
        <div className="mb-12" aria-hidden="true">
          <p className="text-5xl md:text-6xl font-black text-white leading-none tracking-tight">
            R<span className="inline-block w-[0.6em] h-[0.6em] rounded-full border-[5px] border-white align-middle -mt-1 mx-0.5" />OT
          </p>
          <p className="text-5xl md:text-6xl font-black text-white leading-none tracking-tight">
            FURTHER
          </p>
        </div>

        <div className="flex flex-col gap-5 text-left mb-10">
          <p className="text-white/70 text-base leading-relaxed">{t("root_further_body_1")}</p>
          <p className="text-white/70 text-base leading-relaxed">{t("root_further_body_2")}</p>
          <p className="text-white/70 text-base leading-relaxed">{t("root_further_body_3")}</p>
        </div>
        <blockquote className="text-yellow-400 text-xl md:text-2xl italic font-semibold">
          &ldquo;{t("root_further_quote")}&rdquo;
        </blockquote>
        <p className="text-white/40 text-sm mt-2">{t("root_further_quote_note")}</p>
      </div>
    </section>
  );
}
