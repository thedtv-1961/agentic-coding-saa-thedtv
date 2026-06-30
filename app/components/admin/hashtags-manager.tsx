"use client";

import { useRef, useState, useTransition } from "react";
import { addHashtag, deleteHashtag } from "@/app/actions/admin/manage-hashtags";

interface HashtagRow {
  id: string;
  name: string;
  usageCount: number;
}

interface Props {
  rows: HashtagRow[];
}

function errorMessage(err: unknown): string {
  if (!(err instanceof Error)) return "Unknown error";
  switch (err.message) {
    case "EMPTY_NAME":
      return "Tên hashtag không được để trống.";
    case "DUPLICATE":
      return "Hashtag này đã tồn tại.";
    case "HASHTAG_IN_USE":
      return "Hashtag đang được dùng trong kudos, không thể xoá.";
    default:
      return err.message;
  }
}

function AddHashtagForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = inputRef.current?.value ?? "";
    setError(null);
    startTransition(async () => {
      try {
        await addHashtag(name);
        if (inputRef.current) inputRef.current.value = "";
      } catch (err) {
        setError(errorMessage(err));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Tên hashtag mới..."
          maxLength={50}
          className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/40"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-[#FFEA9E]/20 text-[#FFEA9E] border border-[#FFEA9E]/30 text-sm font-medium hover:bg-[#FFEA9E]/30 disabled:opacity-50 disabled:cursor-wait transition-colors"
        >
          {isPending ? "Đang thêm..." : "Thêm"}
        </button>
      </div>
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </form>
  );
}

function DeleteButton({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!confirm("Xoá hashtag này?")) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteHashtag(id);
      } catch (err) {
        setError(errorMessage(err));
      }
    });
  }

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={disabled || isPending}
        title={disabled ? "Đang được dùng trong kudos" : undefined}
        className={[
          "px-3 py-1 rounded text-xs font-medium transition-colors",
          disabled
            ? "bg-white/5 text-white/25 cursor-not-allowed"
            : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-wait",
        ].join(" ")}
      >
        {isPending ? "..." : "Xoá"}
      </button>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </span>
  );
}

export function HashtagsManager({ rows }: Props) {
  return (
    <div>
      <AddHashtagForm />
      {rows.length === 0 ? (
        <p className="text-white/50 text-sm">Chưa có hashtag nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm text-white">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-white/60 font-medium">
                  Tên
                </th>
                <th className="px-4 py-3 text-left text-white/60 font-medium">
                  Số lần dùng
                </th>
                <th className="px-4 py-3 text-right text-white/60 font-medium">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-0"
                >
                  <td className="px-4 py-3 text-white/90 font-mono">
                    #{row.name}
                  </td>
                  <td className="px-4 py-3 text-white/60 tabular-nums">
                    {row.usageCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton
                      id={row.id}
                      disabled={row.usageCount > 0}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
