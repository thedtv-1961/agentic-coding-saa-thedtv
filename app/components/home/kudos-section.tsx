import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function KudosSection() {
  const t = await getTranslations("home");

  return (
    <section className="bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: text content */}
        <div className="flex flex-col gap-6">
          <p className="text-yellow-400 text-xs font-semibold tracking-[0.2em] uppercase">
            {t("kudos_label")}
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            {t("kudos_title")}
          </h2>
          <p className="text-yellow-400 text-xs font-bold tracking-[0.15em] uppercase mt-2">
            {t("kudos_new_label")}
          </p>
          <p className="text-white/65 text-base leading-relaxed">
            {t("kudos_body")}
          </p>
          <div>
            <Link
              href="/kudos"
              className="inline-flex px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-bold text-sm tracking-wider hover:bg-yellow-400 hover:text-black transition-colors rounded"
            >
              {t("kudos_detail")}
            </Link>
          </div>
        </div>

        {/* Right: KUDOS logo */}
        <div
          className="relative aspect-[4/3] max-w-md mx-auto w-full flex items-center justify-center"
          aria-hidden="true"
        >
          {/* Sun* Kudos stylised logo */}
          <div className="flex items-center gap-3 select-none">
            <span className="text-yellow-400 font-black text-7xl md:text-8xl leading-none">
              &#10023;
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-yellow-400 font-black text-4xl md:text-5xl tracking-widest">
                KUDOS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
