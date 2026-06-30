"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { searchProfiles, type ProfileResult } from "@/app/actions/kudos/search-profiles";

interface KudosRecipientFieldProps {
  recipientId: string;
  recipientName: string;
  onSelect: (id: string, name: string) => void;
  error?: string;
}

const DEBOUNCE_MS = 300;

export default function KudosRecipientField({
  recipientId,
  recipientName,
  onSelect,
  error,
}: KudosRecipientFieldProps) {
  const t = useTranslations("kudos");
  const [query, setQuery] = useState(recipientName);
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync displayed name when parent clears selection
  useEffect(() => {
    if (!recipientId) setQuery("");
    else setQuery(recipientName);
  }, [recipientId, recipientName]);

  // Close dropdown on outside click
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

  const runSearch = useCallback(async (value: string) => {
    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await searchProfiles(value);
      if ("error" in result) {
        setResults([]);
      } else {
        setResults(result.data);
        setIsOpen(true);
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    // Clear selection if user types after picking
    if (recipientId) onSelect("", "");

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), DEBOUNCE_MS);
  }

  function handleSelect(profile: ProfileResult) {
    onSelect(profile.id, profile.full_name);
    setQuery(profile.full_name);
    setIsOpen(false);
    setResults([]);
  }

  return (
    <div className="flex flex-row items-center gap-4">
      <label className="text-[22px] font-bold text-[#00101A] w-36 shrink-0 leading-tight">
        {t("recipient_label")}
        <span className="text-red-500 ml-0.5">*</span>
      </label>

      <div ref={containerRef} className="relative flex-1 flex flex-col gap-1">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder={t("recipient_placeholder")}
            autoComplete="off"
            data-testid="recipient-search"
            className={`w-full h-14 border rounded-lg px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              error ? "border-red-500" : "border-[#998C5F]"
            } ${recipientId ? "bg-yellow-50" : "bg-white"}`}
          />
          {isLoading && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ...
            </span>
          )}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        {isOpen && results.length > 0 && (
          <ul className="absolute top-[calc(100%+4px)] left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {results.map((profile) => (
              <li key={profile.id}>
                <button
                  type="button"
                  data-testid="recipient-option"
                  onClick={() => handleSelect(profile)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-yellow-50 text-left transition-colors"
                >
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                      {profile.full_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="text-sm text-gray-800">{profile.full_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
