import "server-only";

import { getUserWithRole } from "@/utils/supabase/get-user-with-role";

/**
 * Asserts the current user is an admin.
 * Throws an error with code "FORBIDDEN" if not.
 * Import this in server action files that require admin privileges.
 */
export async function assertAdmin(): Promise<void> {
  const { isAdmin } = await getUserWithRole();
  if (!isAdmin) throw new Error("FORBIDDEN");
}
