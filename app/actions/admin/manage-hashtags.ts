"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { assertAdmin } from "./assert-admin";

export async function addHashtag(name: string): Promise<{ ok: boolean }> {
  await assertAdmin();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("EMPTY_NAME");
  const supabase = await createClient();
  const { error } = await supabase.from("hashtags").insert({ name: trimmed });
  if (error) {
    if (error.code === "23505") throw new Error("DUPLICATE");
    throw new Error(error.message);
  }
  revalidatePath("/admin/hashtags");
  return { ok: true };
}

export async function deleteHashtag(id: string): Promise<{ ok: boolean }> {
  await assertAdmin();
  const supabase = await createClient();
  const { count } = await supabase
    .from("kudos_hashtags")
    .select("*", { count: "exact", head: true })
    .eq("hashtag_id", id);
  if ((count ?? 0) > 0) throw new Error("HASHTAG_IN_USE");
  const { error } = await supabase.from("hashtags").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/hashtags");
  return { ok: true };
}
