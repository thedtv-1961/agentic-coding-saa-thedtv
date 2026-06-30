"use client";

import { useTransition, useState } from "react";
import Image from "next/image";
import { updateAward } from "@/app/actions/admin/update-award";

interface Award {
  id: string;
  number_of_winners: number;
  winner_unit: number | null;
  prize_value: number;
}

interface AwardCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  awards: Award[];
}

interface Props {
  category: AwardCategory;
}

function winnerUnitLabel(unit: number | null): string {
  if (unit === 1) return "Cá nhân";
  if (unit === 2) return "Tập thể";
  if (unit === 3) return "Đơn vị";
  return "N/A";
}

export function AwardCard({ category }: Props) {
  const award = category.awards[0] ?? null;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [imageUrl, setImageUrl] = useState(category.image_url);
  const [prizeValue, setPrizeValue] = useState(String(award?.prize_value ?? ""));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleEdit() {
    setIsEditing(true);
    setError(null);
  }

  function handleCancel() {
    setName(category.name);
    setDescription(category.description);
    setImageUrl(category.image_url);
    setPrizeValue(String(award?.prize_value ?? ""));
    setError(null);
    setIsEditing(false);
  }

  function handleSave() {
    if (!name.trim()) {
      setError("Tên giải thưởng không được để trống.");
      return;
    }
    if (!award) {
      setError("Không tìm thấy dữ liệu giải thưởng.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await updateAward({
          categoryId: category.id,
          awardId: award.id,
          name,
          description,
          imageUrl,
          prizeValue,
        });
        setIsEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi không xác định.");
      }
    });
  }

  return (
    <div className="bg-black/30 border border-white/10 rounded-lg p-4 flex flex-col gap-4">
      {/* Header row: thumbnail + name */}
      <div className="flex items-start gap-4">
        {imageUrl && (
          <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-white/5">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên giải thưởng"
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60"
            />
          ) : (
            <h3 className="text-white font-semibold text-base leading-tight">
              {name}
            </h3>
          )}

          {/* Read-only: winners + unit */}
          {award && (
            <p className="text-white/40 text-xs mt-1">
              {award.number_of_winners} người thắng &middot;{" "}
              {winnerUnitLabel(award.winner_unit)}
            </p>
          )}
        </div>

        {/* Edit button (view mode only) */}
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="shrink-0 px-3 py-1.5 text-xs rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Description */}
      {isEditing ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả"
          rows={2}
          className="w-full bg-white/5 border border-white/20 rounded px-3 py-1.5 text-white/80 text-sm resize-none focus:outline-none focus:border-[#FFEA9E]/60"
        />
      ) : (
        <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      )}

      {/* Image URL */}
      {isEditing && (
        <div>
          <label className="block text-xs text-white/40 mb-1">URL hình ảnh</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... hoặc /images/..."
            className="w-full bg-white/5 border border-white/20 rounded px-3 py-1.5 text-white/80 text-sm focus:outline-none focus:border-[#FFEA9E]/60"
          />
        </div>
      )}

      {/* Prize value */}
      <div>
        {isEditing ? (
          <div>
            <label className="block text-xs text-white/40 mb-1">Giá trị giải thưởng</label>
            <input
              type="text"
              value={prizeValue}
              onChange={(e) => setPrizeValue(e.target.value)}
              placeholder="VD: 7.000.000 VNĐ"
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-1.5 text-white/80 text-sm focus:outline-none focus:border-[#FFEA9E]/60"
            />
          </div>
        ) : (
          <p className="text-[#FFEA9E] text-sm font-medium">
            {prizeValue || <span className="text-white/30 italic">Chưa có giá trị</span>}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

      {/* Save / Cancel */}
      {isEditing && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-1.5 text-sm rounded bg-[#FFEA9E] text-black font-medium hover:bg-[#FFEA9E]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="px-4 py-1.5 text-sm rounded border border-white/20 text-white/60 hover:text-white hover:border-white/40 disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
}
