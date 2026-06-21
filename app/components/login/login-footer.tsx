import { getTranslations } from "next-intl/server";

export default async function LoginFooter() {
  const t = await getTranslations("login");
  return (
    <footer className="relative z-10 text-center py-4 border-t border-white/10">
      <p className="text-white/70 text-sm font-medium">{t("footer")}</p>
    </footer>
  );
}
