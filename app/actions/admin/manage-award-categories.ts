"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { assertAdmin } from "./assert-admin";

export interface AwardCategoryInput {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
}

export async function addAwardCategory(
  input: AwardCategoryInput
): Promise<{ ok: boolean }> {
  await assertAdmin();
  const name = input.name.trim();
  if (!name) throw new Error("EMPTY_NAME");

  const supabase = await createClient();
  const { error } = await supabase.from("award_categories").insert({
    name,
    title: input.title.trim() || name,
    description: input.description.trim(),
    image_url: input.imageUrl.trim(),
    is_active: true,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/awards");
  revalidatePath("/admin/awards/categories");
  return { ok: true };
}

export async function updateAwardCategory(
  id: string,
  input: AwardCategoryInput
): Promise<{ ok: boolean }> {
  await assertAdmin();
  const name = input.name.trim();
  if (!name) throw new Error("EMPTY_NAME");

  const supabase = await createClient();
  const { error } = await supabase
    .from("award_categories")
    .update({
      name,
      title: input.title.trim() || name,
      description: input.description.trim(),
      image_url: input.imageUrl.trim(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/awards");
  revalidatePath("/admin/awards/categories");
  return { ok: true };
}

export async function deleteAwardCategory(id: string): Promise<{ ok: boolean }> {
  await assertAdmin();
  const supabase = await createClient();

  const { count } = await supabase
    .from("awards")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if ((count ?? 0) > 0) throw new Error("HAS_AWARDS");

  const { error } = await supabase
    .from("award_categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/awards");
  revalidatePath("/admin/awards/categories");
  return { ok: true };
}
