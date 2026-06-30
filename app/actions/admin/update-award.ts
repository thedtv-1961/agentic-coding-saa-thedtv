"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { assertAdmin } from "./assert-admin";

export interface UpdateAwardInput {
  categoryId: string;
  awardId: string;
  name: string;
  description: string;
  imageUrl: string;
  prizeValue: string | number;
}

export async function updateAward(
  input: UpdateAwardInput
): Promise<{ ok: boolean }> {
  await assertAdmin();

  if (!input.categoryId || !input.awardId || !input.name.trim()) {
    throw new Error("INVALID_INPUT");
  }

  const supabase = await createClient();

  const { error: catError } = await supabase
    .from("award_categories")
    .update({
      name: input.name.trim(),
      description: input.description.trim(),
      image_url: input.imageUrl.trim(),
    })
    .eq("id", input.categoryId);

  if (catError) throw new Error(catError.message);

  const prizeNum = Number(String(input.prizeValue).replace(/\D/g, "")) || 0;
  const { error: awardError } = await supabase
    .from("awards")
    .update({ prize_value: prizeNum })
    .eq("id", input.awardId);

  if (awardError) throw new Error(awardError.message);

  revalidatePath("/admin/awards");
  return { ok: true };
}
