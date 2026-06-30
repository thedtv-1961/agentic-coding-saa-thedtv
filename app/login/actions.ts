"use server";

import { createClient } from "@/utils/supabase/server";
import { getUserWithRole } from "@/utils/supabase/get-user-with-role";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") ?? "http://127.0.0.1:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect("/login?error=oauth_init_failed");
  }

  if (data.url) {
    redirect(data.url);
  }
}

export type AdminSignInResult =
  | { error: "invalid_credentials" | "not_admin" | "unknown" }
  | never;

export async function signInAsAdmin(
  email: string,
  password: string
): Promise<AdminSignInResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "invalid_credentials" };

  const { isAdmin } = await getUserWithRole();
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "not_admin" };
  }

  redirect("/admin");
}
