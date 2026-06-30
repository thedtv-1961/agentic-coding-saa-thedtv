"use client";

import { useTransition, useState } from "react";
import { updateAward, deleteAward } from "@/app/actions/admin/update-award";
import type { AwardRow } from "@/app/(admin)/admin/awards/page";

interface CategoryOption {
  id: string;
  name: string;
}

interface Props {
  award: AwardRow;
  categories: CategoryOption[];
}

const WINNER_UNITS = [
  { value: 1, label: "Cá nhân" },
  { value: 2, label: "Tập thể" },
  { value: 3, label: "Đơn vị" },
];

function winnerUnitLabel(unit: number | null): string {
  return WINNER_UNITS.find((u) => u.value === unit)?.label ?? "N/A";
}

const inp =
  "w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60 disabled:opacity-50";
const sel =
  "w-full bg-[#0d1117] border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60 disabled:opacity-50";

export function AwardTableRow({ award, categories }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [categoryId, setCategoryId] = useState(award.category_id);
  const [numberOfWinners, setNumberOfWinners] = useState(String(award.number_of_winners));
  const [winnerUnit, setWinnerUnit] = useState(award.winner_unit ?? 1);
  const [prizeValue, setPrizeValue] = useState(String(award.prize_value));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    setCategoryId(award.category_id);
    setNumberOfWinners(String(award.number_of_winners));
    setWinnerUnit(award.winner_unit ?? 1);
    setPrizeValue(String(award.prize_value));
    setError(null);
    setIsEditing(false);
  }

  function handleSave() {
    if (!categoryId) { setError("Chọn danh mục."); return; }
    setError(null);
    startTransition(async () => {
      try {
        await updateAward({
          awardId: award.id,
          categoryId,
          numberOfWinners: Math.max(1, parseInt(numberOfWinners, 10) || 1),
          winnerUnit,
          prizeValue,
        });
        setIsEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi không xác định.");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Xoá giải thưởng này? Hành động không thể hoàn tác.")) return;
    setError(null);
    startTransition(async () => {
      try { await deleteAward(award.id); }
      catch (err) { setError(err instanceof Error ? err.message : "Lỗi."); }
    });
  }

  if (isEditing) {
    return (
      <tr className="border-b border-white/5 bg-white/5">
        <td className="px-4 py-3">
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
            disabled={isPending} className={sel}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </td>
        <td className="px-4 py-3">
          <input type="number" min={1} value={numberOfWinners}
            onChange={(e) => setNumberOfWinners(e.target.value)}
            disabled={isPending} className={inp} />
        </td>
        <td className="px-4 py-3">
          <select value={winnerUnit} onChange={(e) => setWinnerUnit(Number(e.target.value))}
            disabled={isPending} className={sel}>
            {WINNER_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </td>
        <td className="px-4 py-3">
          <input type="text" value={prizeValue}
            onChange={(e) => setPrizeValue(e.target.value)}
            placeholder="VD: 7000000" disabled={isPending} className={inp} />
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-col gap-1 items-end">
            <div className="flex gap-1">
              <button onClick={handleSave} disabled={isPending}
                className="px-3 py-1 rounded text-xs bg-[#FFEA9E] text-black font-medium hover:bg-[#FFEA9E]/80 disabled:opacity-50 transition-colors">
                {isPending ? "..." : "Lưu"}
              </button>
              <button onClick={handleCancel} disabled={isPending}
                className="px-3 py-1 rounded text-xs border border-white/20 text-white/60 hover:text-white disabled:opacity-50 transition-colors">
                Hủy
              </button>
            </div>
            {error && <span className="text-red-400 text-xs">{error}</span>}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-0">
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFEA9E]/10 text-[#FFEA9E] border border-[#FFEA9E]/20">
          {award.category_name}
        </span>
      </td>
      <td className="px-4 py-3 text-white text-sm tabular-nums">
        {award.number_of_winners}
      </td>
      <td className="px-4 py-3 text-white/70 text-sm">
        {winnerUnitLabel(award.winner_unit)}
      </td>
      <td className="px-4 py-3 text-[#FFEA9E] text-sm font-medium tabular-nums">
        {award.prize_value
          ? award.prize_value.toLocaleString("vi-VN") + " VNĐ"
          : <span className="text-white/30 italic font-normal">Chưa có</span>}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1 justify-end">
          <button onClick={() => setIsEditing(true)}
            className="px-3 py-1 rounded text-xs border border-white/20 text-white/60 hover:text-white transition-colors">
            Sửa
          </button>
          <button onClick={handleDelete} disabled={isPending}
            className="px-3 py-1 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-30 transition-colors">
            Xoá
          </button>
        </div>
      </td>
    </tr>
  );
}

// Keep old name as alias so any other import doesn't break
export { AwardTableRow as AwardCard };
