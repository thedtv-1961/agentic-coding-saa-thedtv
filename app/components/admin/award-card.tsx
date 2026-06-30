"use client";

import { useTransition, useState } from "react";
import { updateAward } from "@/app/actions/admin/update-award";
import type { AwardRow } from "@/app/(admin)/admin/awards/page";

const WINNER_UNITS = [
  { value: 1, label: "Cá nhân" },
  { value: 2, label: "Tập thể" },
  { value: 3, label: "Đơn vị" },
];

function winnerUnitLabel(unit: number | null): string {
  return WINNER_UNITS.find((u) => u.value === unit)?.label ?? "N/A";
}

export function AwardCard({ award }: { award: AwardRow }) {
  const [isEditing, setIsEditing] = useState(false);
  const [numberOfWinners, setNumberOfWinners] = useState(String(award.number_of_winners));
  const [winnerUnit, setWinnerUnit] = useState(award.winner_unit ?? 1);
  const [prizeValue, setPrizeValue] = useState(String(award.prize_value));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    setNumberOfWinners(String(award.number_of_winners));
    setWinnerUnit(award.winner_unit ?? 1);
    setPrizeValue(String(award.prize_value));
    setError(null);
    setIsEditing(false);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await updateAward({
          awardId: award.id,
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

  return (
    <div className="bg-black/30 border border-white/10 rounded-lg p-4 flex flex-col gap-3">
      {/* Category label */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40 uppercase tracking-widest font-medium">
          {award.category_name}
        </span>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-xs rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Số người thắng */}
      <div>
        <p className="text-xs text-white/40 mb-1">Số người thắng</p>
        {isEditing ? (
          <input
            type="number"
            min={1}
            value={numberOfWinners}
            onChange={(e) => setNumberOfWinners(e.target.value)}
            disabled={isPending}
            className="w-full bg-white/5 border border-white/20 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60"
          />
        ) : (
          <p className="text-white font-medium text-sm">{award.number_of_winners}</p>
        )}
      </div>

      {/* Đơn vị */}
      <div>
        <p className="text-xs text-white/40 mb-1">Đơn vị</p>
        {isEditing ? (
          <select
            value={winnerUnit}
            onChange={(e) => setWinnerUnit(Number(e.target.value))}
            disabled={isPending}
            className="w-full bg-[#0d1117] border border-white/20 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60"
          >
            {WINNER_UNITS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        ) : (
          <p className="text-white text-sm">{winnerUnitLabel(award.winner_unit)}</p>
        )}
      </div>

      {/* Giá trị giải thưởng */}
      <div>
        <p className="text-xs text-white/40 mb-1">Giá trị giải thưởng (VNĐ)</p>
        {isEditing ? (
          <input
            type="text"
            value={prizeValue}
            onChange={(e) => setPrizeValue(e.target.value)}
            placeholder="VD: 7000000"
            disabled={isPending}
            className="w-full bg-white/5 border border-white/20 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60"
          />
        ) : (
          <p className="text-[#FFEA9E] font-medium text-sm">
            {award.prize_value
              ? award.prize_value.toLocaleString("vi-VN") + " VNĐ"
              : <span className="text-white/30 italic">Chưa có giá trị</span>}
          </p>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {isEditing && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-1.5 text-sm rounded bg-[#FFEA9E] text-black font-medium hover:bg-[#FFEA9E]/80 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="px-4 py-1.5 text-sm rounded border border-white/20 text-white/60 hover:text-white disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
}
