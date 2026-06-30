"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const NAV_ITEMS = [
  { href: "/admin/kudos", labelKey: "kudos" },
  { href: "/admin/users", labelKey: "users" },
  { href: "/admin/awards", labelKey: "awards" },
  { href: "/admin/hashtags", labelKey: "hashtags" },
  { href: "/admin/settings", labelKey: "settings" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("admin.nav");

  return (
    <aside className="w-56 min-h-screen bg-black/40 border-r border-white/10 p-4 flex flex-col gap-1">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-4 px-3">
        Admin
      </p>
      {NAV_ITEMS.map(({ href, labelKey }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#FFEA9E]/10 text-[#FFEA9E] border-l-2 border-[#FFEA9E]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {t(labelKey)}
          </Link>
        );
      })}
    </aside>
  );
}
