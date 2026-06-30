export const runtime = 'edge';

import { getTranslations } from "next-intl/server";

export default async function TodoPage() {
  const t = await getTranslations("todo");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d1117]">
      <p className="text-white/50 text-lg">{t("coming_soon")}</p>
    </main>
  );
}
