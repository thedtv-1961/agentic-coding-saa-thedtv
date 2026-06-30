import { createClient } from "@/utils/supabase/server";
import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { redirect } from "next/navigation";
import { AwardCard } from "@/app/components/admin/award-card";
import { AddAwardForm } from "@/app/components/admin/add-award-form";
import Link from "next/link";

interface AwardRow {
  id: string;
  number_of_winners: number;
  winner_unit: number | null;
  prize_value: number;
}

interface CategoryRow {
  id: string;
  name: string;
  description: string;
  image_url: string;
  awards: AwardRow[];
}

export default async function AdminAwardsPage() {
  const { isAdmin } = await getUserWithRole();
  if (!isAdmin) redirect("/admin");

  const supabase = await createClient();

  const [categoriesRes, awardsRes] = await Promise.all([
    supabase
      .from("award_categories")
      .select("id, name")
      .order("created_at"),
    supabase
      .from("award_categories")
      .select(
        "id, name, description, image_url, awards(id, number_of_winners, winner_unit, prize_value)"
      )
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
  const awardsData = (awardsRes.data as unknown as CategoryRow[]) ?? [];

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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {awardsData.map((cat) => (
          <AwardCard key={cat.id} category={cat} />
        ))}
      </div>
      {awardsData.length === 0 && (
        <p className="text-white/40 text-sm">Chưa có dữ liệu giải thưởng.</p>
      )}
    </div>
  );
}
