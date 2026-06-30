"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { assertAdmin } from "./assert-admin";

const EDITABLE_KEYS = ["countdown_date"] as const;
type EditableKey = (typeof EDITABLE_KEYS)[number];

export async function updateSetting(
  key: string,
  value: string
): Promise<{ ok: boolean }> {
  await assertAdmin();
  if (!EDITABLE_KEYS.includes(key as EditableKey)) {
    throw new Error("KEY_READONLY");
  }
  if (key === "countdown_date" && isNaN(Date.parse(value))) {
    throw new Error("INVALID_DATE");
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("app_settings")
    .update({ value })
    .eq("key", key);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  return { ok: true };
}
