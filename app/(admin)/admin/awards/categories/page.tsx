import { createClient } from "@/utils/supabase/server";
import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { redirect } from "next/navigation";
import { AwardCategoriesManager } from "@/app/components/admin/award-categories-manager";
import Link from "next/link";

export default async function AdminAwardCategoriesPage() {
  const { isAdmin } = await getUserWithRole();
  if (!isAdmin) redirect("/admin");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("award_categories")
    .select("id, name, title, description, content, image_url, is_active, awards(id)")
    .order("created_at");

  if (error) {
    console.error("Award categories fetch error:", error.message);
    return (
      <div className="text-red-400 p-4">Lỗi tải dữ liệu: {error.message}</div>
    );
  }

  const rows = (
    (data as unknown as Array<{
      id: string;
      name: string;
      title: string;
      description: string;
      content: string;
      image_url: string;
      is_active: boolean;
      awards: { id: string }[];
    }>) ?? []
  ).map((cat) => ({
    id: cat.id,
    name: cat.name,
    title: cat.title ?? "",
    description: cat.description ?? "",
    content: cat.content ?? "",
    image_url: cat.image_url ?? "",
    is_active: cat.is_active ?? true,
    awardCount: Array.isArray(cat.awards) ? cat.awards.length : 0,
  }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/awards"
          className="text-white/40 hover:text-white text-sm transition-colors"
        >
          ← Giải thưởng
        </Link>
        <span className="text-white/20">/</span>
        <h1 className="text-2xl font-bold text-white">Danh mục giải thưởng</h1>
      </div>
      <AwardCategoriesManager rows={rows} />
    </div>
  );
}
