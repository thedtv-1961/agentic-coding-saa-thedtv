import { getTranslations } from "next-intl/server";

export default async function AwardsSectionTitle() {
  const t = await getTranslations("awards");

  return (
    <div className="mb-12">
      <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
        {t("caption")}
      </p>
      <h1 className="text-3xl md:text-5xl font-black text-[#FFEA9E] leading-tight">
        {t("section_title")}
      </h1>
    </div>
  );
}
