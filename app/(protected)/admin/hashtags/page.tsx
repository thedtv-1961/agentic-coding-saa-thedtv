import { createClient } from "@/utils/supabase/server";
import { HashtagsManager } from "@/app/components/admin/hashtags-manager";

interface HashtagRow {
  id: string;
  name: string;
  kudos_hashtags: { count: number }[];
}

export default async function AdminHashtagsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hashtags")
    .select("id, name, kudos_hashtags(count)")
    .order("name");

  if (error) {
    return (
      <div className="p-6 text-red-400">
        Failed to load hashtags: {error.message}
      </div>
    );
  }

  const rows = (data as unknown as HashtagRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    usageCount: row.kudos_hashtags?.[0]?.count ?? 0,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">Hashtags</h1>
      <HashtagsManager rows={rows} />
    </div>
  );
}
