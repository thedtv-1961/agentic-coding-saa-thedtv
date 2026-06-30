import { redirect } from "next/navigation";
import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { AdminSidebar } from "@/app/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await getUserWithRole();
  if (!isAdmin) redirect("/");

  return (
    <div className="flex min-h-screen bg-[#00070C] text-white">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
