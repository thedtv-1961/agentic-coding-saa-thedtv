"use client";

import { useState, useTransition } from "react";
import {
  addAwardCategory,
  updateAwardCategory,
  deleteAwardCategory,
  type AwardCategoryInput,
} from "@/app/actions/admin/manage-award-categories";

interface CategoryRow {
  id: string;
  name: string;
  title: string;
  description: string;
  image_url: string;
  awardCount: number;
}

function errMsg(err: unknown): string {
  if (!(err instanceof Error)) return "Lỗi không xác định.";
  if (err.message === "EMPTY_NAME") return "Tên không được để trống.";
  if (err.message === "HAS_AWARDS") return "Danh mục đang có giải thưởng, không thể xoá.";
  return err.message;
}

// ── Add form ──────────────────────────────────────────────────────────────────
function AddCategoryForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AwardCategoryInput>({
    name: "", title: "", description: "", imageUrl: "",
  });

  function set(k: keyof AwardCategoryInput, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await addAwardCategory(form);
        setForm({ name: "", title: "", description: "", imageUrl: "" });
        setOpen(false);
      } catch (e) { setError(errMsg(e)); }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-6 px-4 py-2 rounded-lg bg-[#FFEA9E]/20 text-[#FFEA9E] border border-[#FFEA9E]/30 text-sm font-medium hover:bg-[#FFEA9E]/30 transition-colors"
      >
        + Thêm danh mục mới
      </button>
    );
  }

  return (
    <div className="mb-6 bg-black/30 border border-white/20 rounded-xl p-5 flex flex-col gap-3">
      <h2 className="text-white font-semibold text-sm">Danh mục mới</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-white/40 mb-1">Tên danh mục *</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)}
            placeholder="VD: Top Talent" disabled={isPending}
            className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60" />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Tiêu đề hiển thị</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)}
            placeholder="Để trống = dùng tên" disabled={isPending}
            className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60" />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">URL hình ảnh</label>
          <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="/images/awards/..." disabled={isPending}
            className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60" />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Mô tả ngắn</label>
          <input value={form.description} onChange={(e) => set("description", e.target.value)}
            placeholder="Mô tả..." disabled={isPending}
            className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60" />
        </div>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={isPending}
          className="px-4 py-2 rounded-lg bg-[#FFEA9E] text-black text-sm font-semibold hover:bg-[#FFEA9E]/80 disabled:opacity-50 transition-colors">
          {isPending ? "Đang lưu..." : "Lưu"}
        </button>
        <button onClick={() => { setOpen(false); setError(null); }} disabled={isPending}
          className="px-4 py-2 rounded-lg border border-white/20 text-white/60 text-sm hover:text-white disabled:opacity-50 transition-colors">
          Hủy
        </button>
      </div>
    </div>
  );
}

// ── Row (view + inline edit) ──────────────────────────────────────────────────
function CategoryRow({ row }: { row: CategoryRow }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AwardCategoryInput>({
    name: row.name, title: row.title, description: row.description, imageUrl: row.image_url,
  });

  function set(k: keyof AwardCategoryInput, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await updateAwardCategory(row.id, form);
        setEditing(false);
      } catch (e) { setError(errMsg(e)); }
    });
  }

  function handleDelete() {
    if (!confirm(`Xoá danh mục "${row.name}"?`)) return;
    setError(null);
    startTransition(async () => {
      try { await deleteAwardCategory(row.id); }
      catch (e) { setError(errMsg(e)); }
    });
  }

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-0">
      {editing ? (
        <>
          <td className="px-4 py-3">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} disabled={isPending}
              className="w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60" />
          </td>
          <td className="px-4 py-3">
            <input value={form.title} onChange={(e) => set("title", e.target.value)} disabled={isPending}
              className="w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60" />
          </td>
          <td className="px-4 py-3">
            <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} disabled={isPending}
              className="w-full bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#FFEA9E]/60" />
          </td>
          <td className="px-4 py-3 text-white/50 text-xs tabular-nums">{row.awardCount}</td>
          <td className="px-4 py-3">
            <div className="flex flex-col gap-1 items-end">
              <div className="flex gap-1">
                <button onClick={handleSave} disabled={isPending}
                  className="px-3 py-1 rounded text-xs bg-[#FFEA9E] text-black font-medium hover:bg-[#FFEA9E]/80 disabled:opacity-50 transition-colors">
                  {isPending ? "..." : "Lưu"}
                </button>
                <button onClick={() => { setEditing(false); setError(null); setForm({ name: row.name, title: row.title, description: row.description, imageUrl: row.image_url }); }} disabled={isPending}
                  className="px-3 py-1 rounded text-xs border border-white/20 text-white/60 hover:text-white disabled:opacity-50 transition-colors">
                  Hủy
                </button>
              </div>
              {error && <span className="text-red-400 text-xs">{error}</span>}
            </div>
          </td>
        </>
      ) : (
        <>
          <td className="px-4 py-3 text-white/90 font-medium text-sm">{row.name}</td>
          <td className="px-4 py-3 text-white/60 text-sm">{row.title}</td>
          <td className="px-4 py-3 text-white/40 text-xs font-mono truncate max-w-[160px]">{row.image_url || "—"}</td>
          <td className="px-4 py-3 text-white/50 text-xs tabular-nums">{row.awardCount}</td>
          <td className="px-4 py-3">
            <div className="flex flex-col gap-1 items-end">
              <div className="flex gap-1">
                <button onClick={() => setEditing(true)}
                  className="px-3 py-1 rounded text-xs border border-white/20 text-white/60 hover:text-white transition-colors">
                  Sửa
                </button>
                <button onClick={handleDelete} disabled={isPending || row.awardCount > 0}
                  title={row.awardCount > 0 ? "Còn giải thưởng trong danh mục" : undefined}
                  className="px-3 py-1 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Xoá
                </button>
              </div>
              {error && <span className="text-red-400 text-xs">{error}</span>}
            </div>
          </td>
        </>
      )}
    </tr>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function AwardCategoriesManager({ rows }: { rows: CategoryRow[] }) {
  return (
    <div>
      <AddCategoryForm />
      {rows.length === 0 ? (
        <p className="text-white/40 text-sm">Chưa có danh mục nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm text-white">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-white/60 font-medium">Tên</th>
                <th className="px-4 py-3 text-left text-white/60 font-medium">Tiêu đề</th>
                <th className="px-4 py-3 text-left text-white/60 font-medium">Hình ảnh</th>
                <th className="px-4 py-3 text-left text-white/60 font-medium">Giải thưởng</th>
                <th className="px-4 py-3 text-right text-white/60 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => <CategoryRow key={row.id} row={row} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
