"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Top Talent", slug: "top-talent" },
  { label: "Top Project", slug: "top-project" },
  { label: "Top Project Leader", slug: "top-project-leader" },
  { label: "Best Manager", slug: "best-manager" },
  { label: "Signature 2025", slug: "signature-2025-creator" },
  { label: "MVP", slug: "mvp" },
] as const;

type Slug = (typeof NAV_ITEMS)[number]["slug"];

interface Props {
  mobile?: boolean;
}

export default function AwardsNav({ mobile = false }: Props) {
  const [activeSlug, setActiveSlug] = useState<Slug>("top-talent");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_ITEMS.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSlug(slug);
        },
        // Top margin pushes trigger point below the sticky header
        { threshold: 0.2, rootMargin: "-96px 0px -55% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function handleClick(slug: Slug) {
    setActiveSlug(slug);
    document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (mobile) {
    return (
      <select
        value={activeSlug}
        onChange={(e) => handleClick(e.target.value as Slug)}
        aria-label="Danh mục giải thưởng"
        className="w-full bg-zinc-900 text-white border border-white/20 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFEA9E]/50"
      >
        {NAV_ITEMS.map(({ label, slug }) => (
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
        {NAV_ITEMS.map(({ label, slug }) => {
          const isActive = activeSlug === slug;
          return (
            <li key={slug}>
              <button
                onClick={() => handleClick(slug)}
                className={[
                  "w-full text-left px-3 py-2 text-sm rounded transition-colors",
                  isActive
                    ? "text-[#FFEA9E] font-bold underline underline-offset-2"
                    : "text-white/60 hover:text-white",
                ].join(" ")}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
