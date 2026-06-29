"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

const MAX_HASHTAGS = 5;

interface Hashtag {
  id: string;
  name: string;
}

interface KudosHashtagFieldProps {
  value: string[];
  onChange: (ids: string[]) => void;
  hashtags: Hashtag[];
  error?: string;
}

export default function KudosHashtagField({
  value,
  onChange,
  hashtags,
  error,
}: KudosHashtagFieldProps) {
  const t = useTranslations("kudos");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleAdd(id: string) {
    if (value.includes(id) || value.length >= MAX_HASHTAGS) return;
    onChange([...value, id]);
    setIsOpen(false);
  }

  function handleRemove(id: string) {
    onChange(value.filter((v) => v !== id));
  }

  const available = hashtags.filter((h) => !value.includes(h.id));
  const selected = hashtags.filter((h) => value.includes(h.id));

  return (
    <div ref={containerRef} className="flex flex-row items-start gap-4">
      <span className="text-[22px] font-bold text-[#00101A] w-36 shrink-0 pt-1 leading-tight">
        {t("hashtag_label")}
        <span className="text-red-500 ml-0.5">*</span>
      </span>

      <div className="flex-1 flex flex-col gap-1">
      <div className="flex items-center gap-1 flex-wrap">
        {/* Selected chips */}
        {selected.map((h) => (
          <span
            key={h.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"
          >
            #{h.name}
            <button
              type="button"
              onClick={() => handleRemove(h.id)}
              className="hover:text-yellow-600 transition-colors ml-0.5 leading-none"
              aria-label={`Remove hashtag ${h.name}`}
            >
              ×
            </button>
          </span>
        ))}

        {/* Add button — hidden when max reached */}
        {value.length < MAX_HASHTAGS && (
          <div className="relative">
            <button
              type="button"
              data-testid="hashtag-add-btn"
              onClick={() => setIsOpen((o) => !o)}
              className="inline-flex items-center gap-1 px-2.5 py-1 border border-dashed border-gray-400 text-gray-500 text-xs rounded-full hover:border-yellow-500 hover:text-yellow-600 transition-colors"
            >
              {t("hashtag_add")}
            </button>

            {isOpen && available.length > 0 && (
              <ul className="absolute top-full left-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px] max-h-48 overflow-y-auto">
                {available.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      data-testid="hashtag-option"
                      onClick={() => handleAdd(h.id)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-yellow-50 transition-colors"
                    >
                      #{h.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {isOpen && available.length === 0 && (
              <div className="absolute top-full left-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs text-gray-400 whitespace-nowrap">
                {t("hashtag_max")}
              </div>
            )}
          </div>
        )}

        {value.length >= MAX_HASHTAGS && (
          <span className="text-xs text-gray-400">{t("hashtag_max")}</span>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
