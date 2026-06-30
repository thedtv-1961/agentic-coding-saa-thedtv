"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/app/components/login/language-switcher";
import ProfileDropdown from "@/app/components/shared/profile-dropdown";

interface Props {
  userAvatarUrl?: string | null;
  isAdmin: boolean;
}

export default function HeaderNav({ userAvatarUrl, isAdmin }: Props) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav_about") },
    { href: "/awards", label: t("nav_awards") },
    { href: "", label: t("nav_kudos") },
  ];

  return (
    <div className="relative">
      <nav className="flex items-center justify-between px-0 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" aria-label="SAA 2025">
          <Image
            src="/images/saa-logo.png"
            alt="SAA 2025"
            width={52}
            height={48}
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative text-sm font-medium transition-colors hover:text-[#FFEA9E] ${
                    isActive
                      ? "text-[#FFEA9E] after:content-[''] after:absolute after:bottom-[-16px] after:left-[-8px] after:right-[-8px] after:h-[2px] after:bg-[#FFEA9E] after:shadow-[0_0_6px_#FAE287]"
                      : "text-white"
                  }`}
                  style={isActive ? { textShadow: "0 0 8px #FAE287" } : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Bell - placeholder */}
          <button
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={t("notification_label")}
            type="button"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <LanguageSwitcher />

          {/* User avatar → profile dropdown */}
          <ProfileDropdown isAdmin={isAdmin} userAvatarUrl={userAvatarUrl} />

          {/* Hamburger - mobile only */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Menu"
            type="button"
          >
            {menuOpen ? (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md md:hidden border-t border-white/10">
          <ul className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`text-base font-medium block transition-colors hover:text-[#FFEA9E] ${
                      isActive ? "text-[#FFEA9E]" : "text-white"
                    }`}
                    style={isActive ? { textShadow: "0 0 8px #FAE287" } : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
