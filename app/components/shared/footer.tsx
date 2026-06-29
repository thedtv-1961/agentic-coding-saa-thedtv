import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import FooterNavLinks from "@/app/components/shared/footer-nav-links";

export default async function Footer() {
  const t = await getTranslations("common");

  const navLinks = [
    { href: "/", label: t("nav_about") },
    { href: "/awards", label: t("nav_awards") },
    { href: null, label: t("nav_kudos") },
    { href: null, label: t("nav_standards") },
  ];

  return (
    <footer className="bg-black border-t border-white/10 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" aria-label="SAA 2025">
          <Image
            src="/images/saa-logo.png"
            alt="SAA 2025"
            width={52}
            height={48}
          />
        </Link>

        <FooterNavLinks links={navLinks} />

        <p className="text-white/40 text-sm">{t("copyright")}</p>
      </div>
    </footer>
  );
}
