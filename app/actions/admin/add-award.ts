"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { assertAdmin } from "./assert-admin";

export interface AddAwardInput {
  categoryId: string;
  numberOfWinners: number;
  winnerUnit: number;
  prizeValue: string;
}

export async function addAward(input: AddAwardInput): Promise<{ ok: boolean }> {
  await assertAdmin();
  if (!input.categoryId) throw new Error("NO_CATEGORY");

  const prizeNum = Number(input.prizeValue.replace(/\D/g, "")) || 0;
  const supabase = await createClient();

  const { error } = await supabase.from("awards").insert({
    category_id: input.categoryId,
    number_of_winners: Math.max(1, input.numberOfWinners),
    winner_unit: input.winnerUnit,
    prize_value: prizeNum,
    is_active: true,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/awards");
  return { ok: true };
}
