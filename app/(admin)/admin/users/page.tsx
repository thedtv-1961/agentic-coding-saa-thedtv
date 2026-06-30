import { createClient } from "@/utils/supabase/server";
import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { redirect } from "next/navigation";
import UsersTable from "@/app/components/admin/users-table";

export default async function AdminUsersPage() {
  const { user, isAdmin } = await getUserWithRole();
  if (!isAdmin) redirect("/admin");
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, hero_level, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div className="text-red-400 p-6">
        Failed to load users: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">Users</h1>
      <UsersTable rows={rows ?? []} currentUserId={user!.id} />
    </div>
  );
}
