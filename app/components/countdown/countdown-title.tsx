import { getTranslations } from "next-intl/server";

export default async function CountdownTitle() {
  const t = await getTranslations("countdown");
  return (
    <h1 className="text-white text-xl font-bold text-center tracking-wide">
      {t("title")}
    </h1>
  );
}
