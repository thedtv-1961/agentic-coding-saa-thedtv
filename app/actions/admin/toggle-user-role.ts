"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getUserWithRole } from "@/utils/supabase/get-user-with-role";

export async function toggleUserRole(
  targetId: string
): Promise<{ ok: boolean; role: string }> {
  const { user, isAdmin } = await getUserWithRole();
  if (!isAdmin) throw new Error("FORBIDDEN");
  if (user?.id === targetId) {
    throw new Error("CANNOT_DEMOTE_SELF");
  }

  const supabase = await createClient();

  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", targetId)
    .single();

  if (fetchError || !profile) {
    throw new Error("USER_NOT_FOUND");
  }

  const newRole = profile.role === "admin" ? "user" : "admin";

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/users");
  return { ok: true, role: newRole };
}
