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

// 24×24 circle + checkmark — shown on selected rows
function IconCheck() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="1.5"/>
      <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleToggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else if (value.length < MAX_HASHTAGS) {
      onChange([...value, id]);
      // close when max reached
      if (value.length + 1 >= MAX_HASHTAGS) setIsOpen(false);
    }
  }

  const selected = hashtags.filter((h) => value.includes(h.id));

  return (
    <div ref={containerRef} className="flex flex-row items-start gap-4">
      <span className="text-[22px] font-bold text-[#00101A] w-36 shrink-0 pt-1 leading-tight">
        {t("hashtag_label")}
        <span className="text-red-500 ml-0.5">*</span>
      </span>

      <div className="flex-1 flex flex-col gap-1">
        {/* Selected chips */}
        <div className="flex items-center gap-1 flex-wrap">
          {selected.map((h) => (
            <span
              key={h.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"
            >
              #{h.name}
              <button
                type="button"
                onClick={() => handleToggle(h.id)}
                className="hover:text-yellow-600 transition-colors ml-0.5 leading-none"
                aria-label={`Remove hashtag ${h.name}`}
              >
                ×
              </button>
            </span>
          ))}

          {/* Add button */}
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

              {isOpen && (
                <ul
                  className="absolute top-[calc(100%+4px)] left-0 z-20 min-w-[200px] rounded-lg border border-[#998C5F] bg-[#00070C] p-1.5 shadow-lg max-h-60 overflow-y-auto"
                  data-testid="hashtag-dropdown"
                >
                  {hashtags.map((h) => {
                    const isSelected = value.includes(h.id);
                    const isDisabled = !isSelected && value.length >= MAX_HASHTAGS;
                    return (
                      <li key={h.id}>
                        <button
                          type="button"
                          data-testid="hashtag-option"
                          disabled={isDisabled}
                          onClick={() => handleToggle(h.id)}
                          className={`w-full flex items-center justify-between h-10 px-4 rounded-sm transition-colors
                            font-bold text-base text-white tracking-[0.15px]
                            ${isSelected
                              ? "bg-[rgba(255,234,158,0.20)] hover:bg-[rgba(255,234,158,0.30)]"
                              : isDisabled
                                ? "opacity-40 cursor-not-allowed"
                                : "bg-transparent hover:bg-white/5"
                            }`}
                        >
                          <span>#{h.name}</span>
                          {/* Always render 24×24 slot to keep layout stable */}
                          <span className="w-6 h-6 flex items-center justify-center shrink-0">
                            {isSelected && <IconCheck />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
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
