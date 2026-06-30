import { createClient } from "@/utils/supabase/server";
import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { redirect } from "next/navigation";
import { AwardCard } from "@/app/components/admin/award-card";

interface AwardRow {
  id: string;
  number_of_winners: number;
  winner_unit: number | null;
  prize_value: string;
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

  const { data, error } = await supabase
    .from("award_categories")
    .select(
      "id, name, description, image_url, awards(id, number_of_winners, winner_unit, prize_value)"
    )
    .order("created_at");

  if (error) {
    console.error("Awards fetch error:", error.message);
    return (
      <div className="text-red-400 p-4">
        Lỗi tải dữ liệu: {error.message}
      </div>
    );
  }

  const categories = (data as unknown as CategoryRow[]) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Quản lý Giải thưởng</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat) => (
          <AwardCard key={cat.id} category={cat} />
        ))}
      </div>
      {categories.length === 0 && (
        <p className="text-white/40 text-sm">Chưa có dữ liệu giải thưởng.</p>
      )}
    </div>
  );
}
