"use client";

import { useEffect, useState } from "react";

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="6 6 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 6C14.6868 6 13.3864 6.25866 12.1732 6.7612C10.9599 7.26375 9.85752 8.00035 8.92893 8.92893C7.05357 10.8043 6 13.3478 6 16C6 18.6522 7.05357 21.1957 8.92893 23.0711C9.85752 23.9997 10.9599 24.7362 12.1732 25.2388C13.3864 25.7413 14.6868 26 16 26C18.6522 26 21.1957 24.9464 23.0711 23.0711C24.9464 21.1957 26 18.6522 26 16C26 14.84 25.79 13.69 25.39 12.61L23.79 14.21C23.93 14.8 24 15.4 24 16C24 18.1217 23.1571 20.1566 21.6569 21.6569C20.1566 23.1571 18.1217 24 16 24C13.8783 24 11.8434 23.1571 10.3431 21.6569C8.84285 20.1566 8 18.1217 8 16C8 13.8783 8.84285 11.8434 10.3431 10.3431C11.8434 8.84285 13.8783 8 16 8C16.6 8 17.2 8.07 17.79 8.21L19.4 6.6C18.31 6.21 17.16 6 16 6ZM23 6L19 10V11.5L16.45 14.05C16.3 14 16.15 14 16 14C15.4696 14 14.9609 14.2107 14.5858 14.5858C14.2107 14.9609 14 15.4696 14 16C14 16.5304 14.2107 17.0391 14.5858 17.4142C14.9609 17.7893 15.4696 18 16 18C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16C18 15.85 18 15.7 17.95 15.55L20.5 13H22L26 9H23V6ZM16 10C14.4087 10 12.8826 10.6321 11.7574 11.7574C10.6321 12.8826 10 14.4087 10 16C10 17.5913 10.6321 19.1174 11.7574 20.2426C12.8826 21.3679 14.4087 22 16 22C17.5913 22 19.1174 21.3679 20.2426 20.2426C21.3679 19.1174 22 17.5913 22 16H20C20 17.0609 19.5786 18.0783 18.8284 18.8284C18.0783 19.5786 17.0609 20 16 20C14.9391 20 13.9217 19.5786 13.1716 13.1716C13.9217 12.4214 14.9391 12 16 12V10Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface NavItem {
  label: string;
  slug: string;
}

interface Props {
  navItems: NavItem[];
  mobile?: boolean;
}

export default function AwardsNav({ navItems, mobile = false }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>(navItems[0]?.slug ?? "");

  useEffect(() => {
    if (navItems.length === 0) return;
    const observers: IntersectionObserver[] = [];

    navItems.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSlug(slug);
        },
        { threshold: 0.2, rootMargin: "-96px 0px -55% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [navItems]);

  function handleClick(slug: string) {
    setActiveSlug(slug);
    document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (mobile) {
    return (
      <select
        value={activeSlug}
        onChange={(e) => handleClick(e.target.value)}
        aria-label="Danh mục giải thưởng"
        className="w-full bg-zinc-900 text-white border border-white/20 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFEA9E]/50"
      >
        {navItems.map(({ label, slug }) => (
          <option key={slug} value={slug}>
            {label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <nav aria-label="Danh mục giải thưởng">
      <ul className="flex flex-col gap-1">
        {navItems.map(({ label, slug }) => {
          const isActive = activeSlug === slug;
          return (
            <li key={slug}>
              <button
                onClick={() => handleClick(slug)}
                className={[
                  "w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center gap-2",
                  isActive
                    ? "text-[#FFEA9E] font-bold underline underline-offset-2"
                    : "text-white/60 hover:text-white",
                ].join(" ")}
              >
                <TargetIcon className="shrink-0 w-5 h-5" />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
