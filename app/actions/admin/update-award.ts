"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { assertAdmin } from "./assert-admin";

export interface UpdateAwardInput {
  awardId: string;
  numberOfWinners: number;
  winnerUnit: number;
  prizeValue: string | number;
}

export async function updateAward(
  input: UpdateAwardInput
): Promise<{ ok: boolean }> {
  await assertAdmin();
  if (!input.awardId) throw new Error("INVALID_INPUT");

  const supabase = await createClient();
  const prizeNum = Number(String(input.prizeValue).replace(/\D/g, "")) || 0;

  const { error } = await supabase
    .from("awards")
    .update({
      number_of_winners: Math.max(1, input.numberOfWinners),
      winner_unit: input.winnerUnit,
      prize_value: prizeNum,
    })
    .eq("id", input.awardId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/awards");
  return { ok: true };
}
