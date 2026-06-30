import { createClient } from "@/utils/supabase/server";

interface AuthUserWithRole {
  user: Awaited<ReturnType<Awaited<ReturnType<typeof createClient>>["auth"]["getUser"]>>["data"]["user"];
  isAdmin: boolean;
}

/** Returns the current session user + whether they hold the 'admin' role. */
export async function getUserWithRole(): Promise<AuthUserWithRole> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, isAdmin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { user, isAdmin: profile?.role === "admin" };
}
