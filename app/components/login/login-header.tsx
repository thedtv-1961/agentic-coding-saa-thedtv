import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "./language-switcher";

export default async function LoginHeader() {
  const t = await getTranslations("login");
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <Link href="/" aria-label={t("logo_alt")}>
        <Image
          src="/images/saa-logo.png"
          alt={t("logo_alt")}
          width={69}
          height={64}
          priority
        />
      </Link>
      <LanguageSwitcher />
    </header>
  );
}
