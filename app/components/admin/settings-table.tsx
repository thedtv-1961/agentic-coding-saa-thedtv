"use client";

import { useState, useTransition } from "react";
import { updateSetting } from "@/app/actions/admin/update-setting";

interface SettingRow {
  key: string;
  value: string | null;
}

interface Props {
  rows: SettingRow[];
  editableKeys: string[];
}

function errorMessage(err: unknown): string {
  if (!(err instanceof Error)) return "Unknown error";
  switch (err.message) {
    case "KEY_READONLY":
      return "Key này không thể chỉnh sửa.";
    case "INVALID_DATE":
      return "Ngày không hợp lệ. Vui lòng nhập định dạng ISO (vd: 2025-12-31T00:00:00).";
    default:
      return err.message;
  }
}

// countdown_date is stored as ISO 8601 with +07:00 timezone.
// datetime-local input uses YYYY-MM-DDTHH:mm — strip timezone for display,
// reattach +07:00 when saving.
const DATETIME_KEYS = new Set(["countdown_date"]);

function toDatetimeLocal(iso: string): string {
  // Take the first 16 chars: "2025-12-20T00:00"
  return iso.slice(0, 16);
}

function toIsoVietnam(datetimeLocal: string): string {
  return `${datetimeLocal}:00+07:00`;
}

function EditableRow({ row }: { row: SettingRow }) {
  const isDatetime = DATETIME_KEYS.has(row.key);
  const initialValue = isDatetime && row.value
    ? toDatetimeLocal(row.value)
    : (row.value ?? "");

  const [value, setValue] = useState(initialValue);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    setSaved(false);
    const saveValue = isDatetime ? toIsoVietnam(value) : value;
    startTransition(async () => {
      try {
        await updateSetting(row.key, saveValue);
        setSaved(true);
      } catch (err) {
        setError(errorMessage(err));
      }
    });
  }

  const inputClass =
    "w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-white/40 disabled:opacity-50";

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-0">
      <td className="px-4 py-3 text-white/60 font-mono text-xs align-top pt-4">
        {row.key}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-col gap-1">
          {isDatetime ? (
            <input
              type="datetime-local"
              value={value}
              onChange={(e) => { setValue(e.target.value); setSaved(false); setError(null); }}
              className={inputClass}
              disabled={isPending}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); setSaved(false); setError(null); }}
              className={inputClass}
              disabled={isPending}
            />
          )}
          {error && <p className="text-red-400 text-xs">{error}</p>}
          {saved && <p className="text-green-400 text-xs">Đã lưu.</p>}
        </div>
      </td>
      <td className="px-4 py-3 text-right align-top pt-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-3 py-1 rounded text-xs font-medium bg-[#FFEA9E]/20 text-[#FFEA9E] border border-[#FFEA9E]/30 hover:bg-[#FFEA9E]/30 disabled:opacity-50 disabled:cursor-wait transition-colors"
        >
          {isPending ? "Đang lưu..." : "Lưu"}
        </button>
      </td>
    </tr>
  );
}

function ReadonlyRow({ row }: { row: SettingRow }) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-0">
      <td className="px-4 py-3 text-white/60 font-mono text-xs">
        {row.key}
      </td>
      <td className="px-4 py-3 text-white/80 text-sm break-all">
        {row.value ?? <span className="text-white/30 italic">—</span>}
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-white/25 text-xs">Read-only</span>
      </td>
    </tr>
  );
}

export function SettingsTable({ rows, editableKeys }: Props) {
  if (rows.length === 0) {
    return <p className="text-white/50 text-sm">Không có settings nào.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-4 py-3 text-left text-white/60 font-medium w-1/4">
              Key
            </th>
            <th className="px-4 py-3 text-left text-white/60 font-medium">
              Value
            </th>
            <th className="px-4 py-3 text-right text-white/60 font-medium w-28">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
            editableKeys.includes(row.key) ? (
              <EditableRow key={row.key} row={row} />
            ) : (
              <ReadonlyRow key={row.key} row={row} />
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
