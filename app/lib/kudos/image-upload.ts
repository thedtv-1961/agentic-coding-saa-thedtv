"use client";

import { createClient } from "@/utils/supabase/client";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_KUDOS_IMAGES = 5;
export const KUDOS_IMAGES_BUCKET = "kudos-images";

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "Chỉ hỗ trợ định dạng JPG, PNG, WEBP" };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, error: "Ảnh tối đa 5MB" };
  }
  return { valid: true };
}

export async function uploadKudosImage(
  file: File,
  userId: string,
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(KUDOS_IMAGES_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from(KUDOS_IMAGES_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}
