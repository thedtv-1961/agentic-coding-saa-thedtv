"use client";

import { useState, useTransition } from "react";
import { addAward } from "@/app/actions/admin/add-award";

interface CategoryOption {
  id: string;
  name: string;
}

const WINNER_UNITS = [
  { value: 1, label: "Cá nhân" },
  { value: 2, label: "Tập thể" },
  { value: 3, label: "Đơn vị" },
];

export function AddAwardForm({ categories }: { categories: CategoryOption[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [numberOfWinners, setNumberOfWinners] = useState("1");
  const [winnerUnit, setWinnerUnit] = useState(1);
  const [prizeValue, setPrizeValue] = useState("");

  function reset() {
    setCategoryId(categories[0]?.id ?? "");
    setNumberOfWinners("1");
    setWinnerUnit(1);
    setPrizeValue("");
    setError(null);
  }

  function handleSave() {
    if (!categoryId) { setError("Vui lòng chọn danh mục."); return; }
    setError(null);
    startTransition(async () => {
      try {
        await addAward({
          categoryId,
          numberOfWinners: Math.max(1, parseInt(numberOfWinners, 10) || 1),
          winnerUnit,
          prizeValue,
        });
        reset();
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lỗi không xác định.");
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-6 px-4 py-2 rounded-lg bg-[#FFEA9E]/20 text-[#FFEA9E] border border-[#FFEA9E]/30 text-sm font-medium hover:bg-[#FFEA9E]/30 transition-colors"
      >
        + Thêm giải thưởng mới
      </button>
    );
  }

  return (
    <div className="mb-6 bg-black/30 border border-white/20 rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-white font-semibold text-sm">Thêm giải thưởng mới</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Category combobox */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-white/40 mb-1">Danh mục giải thưởng *</label>
          {categories.length === 0 ? (
            <p className="text-yellow-400 text-xs">
              Chưa có danh mục. Vui lòng{" "}
              <a href="/admin/awards/categories" className="underline">tạo danh mục</a> trước.
            </p>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isPending}
              className="w-full bg-[#0d1117] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1">Số người thắng</label>
          <input
            type="number" min={1} value={numberOfWinners}
            onChange={(e) => setNumberOfWinners(e.target.value)}
            disabled={isPending}
            className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60"
          />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1">Đơn vị</label>
          <select
            value={winnerUnit}
            onChange={(e) => setWinnerUnit(Number(e.target.value))}
            disabled={isPending}
            className="w-full bg-[#0d1117] border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60"
          >
            {WINNER_UNITS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1">Giá trị giải thưởng (VNĐ)</label>
          <input
            type="text" value={prizeValue}
            onChange={(e) => setPrizeValue(e.target.value)}
            placeholder="VD: 7000000"
            disabled={isPending}
            className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={isPending || categories.length === 0}
          className="px-4 py-2 rounded-lg bg-[#FFEA9E] text-black text-sm font-semibold hover:bg-[#FFEA9E]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isPending ? "Đang lưu..." : "Lưu"}
        </button>
        <button onClick={() => { reset(); setOpen(false); }} disabled={isPending}
          className="px-4 py-2 rounded-lg border border-white/20 text-white/60 text-sm hover:text-white disabled:opacity-50 transition-colors">
          Hủy
        </button>
      </div>
    </div>
  );
}
