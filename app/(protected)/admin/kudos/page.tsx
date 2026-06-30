import { createClient } from "@/utils/supabase/server";
import { KudosTable } from "@/app/components/admin/kudos-table";

const PAGE_SIZE = 20;

interface KudosRow {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_anonymous: boolean;
  sender: { full_name: string } | null;
  receiver: { full_name: string } | null;
  kudos_hashtags: { hashtags: { name: string } | null }[];
  kudos_images: { id: string }[];
}

interface PageProps {
  searchParams?: Promise<{ page?: string }>;
}

export default async function AdminKudosPage({ searchParams }: PageProps) {
  const params = await (searchParams ?? Promise.resolve({ page: undefined }));
  const page = Math.max(1, Number(params.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  // Fetch paginated kudos with joins
  const { data: rows, error } = await supabase
    .from("kudos")
    .select(`
      id,
      title,
      content,
      created_at,
      is_anonymous,
      sender:profiles!kudos_sender_id_fkey(full_name),
      receiver:profiles!kudos_receiver_id_fkey(full_name),
      kudos_hashtags(hashtags(name)),
      kudos_images(id)
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) {
    console.error("Kudos fetch error:", error.message);
    return (
      <div className="text-red-400 p-4">
        Lỗi tải dữ liệu: {error.message}
      </div>
    );
  }

  // Get total count
  const { count } = await supabase
    .from("kudos")
    .select("*", { count: "exact", head: true });

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Kudos Management</h1>
      <KudosTable
        rows={(rows as unknown as KudosRow[]) ?? []}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
