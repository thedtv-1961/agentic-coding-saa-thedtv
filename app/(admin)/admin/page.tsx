export const runtime = 'edge';

import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/app/components/admin/admin-login-form";

export default async function AdminRootPage() {
  const { isAdmin } = await getUserWithRole();
  if (isAdmin) redirect("/admin/kudos");
  return <AdminLoginForm />;
}
