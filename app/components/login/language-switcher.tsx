"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

const LOCALES = [
  { code: "vi", label: "VN", flag: "/icons/flag-vn.svg" },
  { code: "en", label: "EN", flag: "/icons/flag-en.svg" },
] as const;

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  function selectLocale(code: string) {
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000`;
    setOpen(false);
    window.location.reload();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Image
          src={current.flag}
          alt={current.label}
          width={24}
          height={16}
          unoptimized
        />
        <span className="text-white text-sm font-medium">{current.label}</span>
        <svg
          className={`w-4 h-4 text-white transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 bg-[#1a1a2e] border border-white/20 rounded-lg overflow-hidden shadow-lg min-w-[100px]"
        >
          {LOCALES.map((locale) => (
            <li key={locale.code}>
              <button
                role="option"
                aria-selected={locale.code === currentLocale}
                onClick={() => selectLocale(locale.code)}
                className="flex items-center gap-2 px-4 py-2 w-full text-left text-white text-sm hover:bg-white/10 cursor-pointer transition-colors"
              >
                <Image
                  src={locale.flag}
                  alt={locale.label}
                  width={24}
                  height={16}
                  unoptimized
                />
                <span>{locale.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
