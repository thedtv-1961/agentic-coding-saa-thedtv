"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { assertAdmin } from "./assert-admin";

export async function deleteKudos(id: string): Promise<{ ok: boolean }> {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("kudos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/kudos");
  return { ok: true };
}
