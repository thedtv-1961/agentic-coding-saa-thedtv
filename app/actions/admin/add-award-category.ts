"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { assertAdmin } from "./assert-admin";

export interface AddAwardCategoryInput {
  name: string;
  description: string;
  imageUrl: string;
  numberOfWinners: number;
  winnerUnit: number;
  prizeValue: string;
}

export async function addAwardCategory(
  input: AddAwardCategoryInput
): Promise<{ ok: boolean }> {
  await assertAdmin();

  const name = input.name.trim();
  if (!name) throw new Error("EMPTY_NAME");

  const prizeNum = Number(input.prizeValue.replace(/\D/g, "")) || 0;

  const supabase = await createClient();

  const { data: cat, error: catError } = await supabase
    .from("award_categories")
    .insert({
      name,
      title: name,
      description: input.description.trim(),
      image_url: input.imageUrl.trim(),
      is_active: true,
    })
    .select("id")
    .single();

  if (catError) throw new Error(catError.message);

  const { error: awardError } = await supabase.from("awards").insert({
    category_id: cat.id,
    number_of_winners: input.numberOfWinners,
    winner_unit: input.winnerUnit,
    prize_value: prizeNum,
    is_active: true,
  });

  if (awardError) throw new Error(awardError.message);

  revalidatePath("/admin/awards");
  return { ok: true };
}
