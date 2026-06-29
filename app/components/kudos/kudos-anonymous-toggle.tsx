"use client";

import { useTranslations } from "next-intl";

interface KudosAnonymousToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

export default function KudosAnonymousToggle({
  checked,
  onChange,
}: KudosAnonymousToggleProps) {
  const t = useTranslations("kudos");

  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-yellow-400 accent-yellow-400 cursor-pointer"
        data-testid="kudos-anonymous-checkbox"
      />
      <span className="text-sm text-gray-700">{t("anonymous_label")}</span>
    </label>
  );
}
