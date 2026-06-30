import { createClient } from "@/utils/supabase/server";
import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { redirect } from "next/navigation";
import { AwardCard } from "@/app/components/admin/award-card";
import { AddAwardForm } from "@/app/components/admin/add-award-form";
import Link from "next/link";

export interface AwardRow {
  id: string;
  category_id: string;
  category_name: string;
  number_of_winners: number;
  winner_unit: number | null;
  prize_value: number;
}

export default async function AdminAwardsPage() {
  const { isAdmin } = await getUserWithRole();
  if (!isAdmin) redirect("/admin");

  const supabase = await createClient();

  const [categoriesRes, awardsRes] = await Promise.all([
    supabase.from("award_categories").select("id, name").order("created_at"),
    supabase
      .from("awards")
      .select("id, category_id, number_of_winners, winner_unit, prize_value, award_categories(name)")
      .order("created_at"),
  ]);

  if (awardsRes.error) {
    console.error("Awards fetch error:", awardsRes.error.message);
    return (
      <div className="text-red-400 p-4">
        Lỗi tải dữ liệu: {awardsRes.error.message}
      </div>
    );
  }

  const categories = (categoriesRes.data as { id: string; name: string }[]) ?? [];

  const awards: AwardRow[] = (
    (awardsRes.data ?? []) as unknown as Array<{
      id: string;
      category_id: string;
      number_of_winners: number;
      winner_unit: number | null;
      prize_value: number;
      award_categories: { name: string } | null;
    }>
  ).map((a) => ({
    id: a.id,
    category_id: a.category_id,
    category_name: a.award_categories?.name ?? "—",
    number_of_winners: a.number_of_winners,
    winner_unit: a.winner_unit,
    prize_value: a.prize_value,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Quản lý Giải thưởng</h1>
        <Link
          href="/admin/awards/categories"
          className="text-sm text-white/50 hover:text-[#FFEA9E] transition-colors"
        >
          Quản lý danh mục →
        </Link>
      </div>
      <AddAwardForm categories={categories} />
      {awards.length === 0 ? (
        <p className="text-white/40 text-sm">Chưa có dữ liệu giải thưởng.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm text-white">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-white/60 font-medium">Danh mục</th>
                <th className="px-4 py-3 text-left text-white/60 font-medium">Số người thắng</th>
                <th className="px-4 py-3 text-left text-white/60 font-medium">Đơn vị</th>
                <th className="px-4 py-3 text-left text-white/60 font-medium">Giá trị giải thưởng</th>
                <th className="px-4 py-3 text-right text-white/60 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((award) => (
                <AwardCard key={award.id} award={award} categories={categories} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
