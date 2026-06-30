"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

const LOCALES = [
  { code: "vi", label: "VN", name: "Tiếng Việt", flag: "/icons/flag-vn.svg" },
  { code: "en", label: "EN", name: "Tiếng Anh", flag: "/icons/flag-en.svg" },
] as const;

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  function selectLocale(code: string) {
    setOpen(false);
    if (code === currentLocale) return;
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000`;
    window.location.reload();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Image src={current.flag} alt={current.label} width={24} height={16} unoptimized />
        <span className="text-white text-sm font-medium">{current.label}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 bg-[#00070C] border border-[#998C5F] rounded-lg shadow-lg p-[6px] flex flex-col min-w-[120px]"
        >
          {LOCALES.map((locale) => {
            const isSelected = locale.code === currentLocale;
            return (
              <li
                key={locale.code}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => selectLocale(locale.code)}
                onKeyDown={(e) => e.key === "Enter" && selectLocale(locale.code)}
                className={`flex items-center gap-2 px-4 h-14 w-full text-white text-sm cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-[#FFEA9E]/20 rounded-sm"
                    : "hover:bg-[#FFEA9E]/10"
                }`}
              >
                <Image src={locale.flag} alt={locale.label} width={24} height={16} unoptimized />
                <span>{locale.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
