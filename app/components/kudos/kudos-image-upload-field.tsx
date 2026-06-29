"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  validateImageFile,
  uploadKudosImage,
  MAX_KUDOS_IMAGES,
  ACCEPTED_IMAGE_TYPES,
} from "@/app/lib/kudos/image-upload";

interface ImageEntry {
  previewUrl: string;   // object URL for local preview
  publicUrl: string | null;  // null while uploading
  uploading: boolean;
  error: string | null;
}

interface KudosImageUploadFieldProps {
  userId: string;
  imageUrls: string[];
  onUrlsChange: (urls: string[]) => void;
}

export default function KudosImageUploadField({
  userId,
  imageUrls,
  onUrlsChange,
}: KudosImageUploadFieldProps) {
  const t = useTranslations("kudos");
  const inputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<ImageEntry[]>([]);

  function syncUrls(updated: ImageEntry[]) {
    const uploaded = updated
      .filter((e) => e.publicUrl !== null)
      .map((e) => e.publicUrl as string);
    onUrlsChange(uploaded);
  }

  async function handleFiles(files: FileList) {
    const remaining = MAX_KUDOS_IMAGES - entries.length;
    const toProcess = Array.from(files).slice(0, remaining);

    const newEntries: ImageEntry[] = toProcess.map((file) => ({
      previewUrl: URL.createObjectURL(file),
      publicUrl: null,
      uploading: true,
      error: null,
    }));

    const next = [...entries, ...newEntries];
    setEntries(next);

    await Promise.all(
      toProcess.map(async (file, i) => {
        const idx = entries.length + i;

        const validation = validateImageFile(file);
        if (!validation.valid) {
          setEntries((prev) => {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              uploading: false,
              error: validation.error ?? "Invalid file",
            };
            return updated;
          });
          return;
        }

        try {
          const url = await uploadKudosImage(file, userId);
          setEntries((prev) => {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              publicUrl: url,
              uploading: false,
            };
            syncUrls(updated);
            return updated;
          });
        } catch (err) {
          setEntries((prev) => {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              uploading: false,
              error: err instanceof Error ? err.message : "Upload failed",
            };
            return updated;
          });
        }
      }),
    );

    // Reset input so same file can be re-selected after removal
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove(idx: number) {
    setEntries((prev) => {
      const entry = prev[idx];
      URL.revokeObjectURL(entry.previewUrl);
      const updated = prev.filter((_, i) => i !== idx);
      syncUrls(updated);
      return updated;
    });
  }

  const canAdd = entries.length < MAX_KUDOS_IMAGES;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-gray-700">{t("image_label")}</span>
        <span className="text-xs text-gray-400 ml-1">
          ({entries.length}/{MAX_KUDOS_IMAGES})
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Thumbnails */}
        {entries.map((entry, idx) => (
          <div
            key={entry.previewUrl}
            className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0"
          >
            <Image
              src={entry.previewUrl}
              alt={`Upload preview ${idx + 1}`}
              fill
              className="object-cover"
              unoptimized
            />

            {/* Uploading overlay */}
            {entry.uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xs">...</span>
              </div>
            )}

            {/* Error overlay */}
            {entry.error && (
              <div className="absolute inset-0 bg-red-500/60 flex items-center justify-center p-1">
                <span className="text-white text-[10px] text-center leading-tight">
                  {entry.error}
                </span>
              </div>
            )}

            {/* Remove button */}
            {!entry.uploading && (
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                aria-label="Remove image"
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/80 transition-colors leading-none"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {/* Add button */}
        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 text-xs flex flex-col items-center justify-center gap-1 hover:border-yellow-400 hover:text-yellow-500 transition-colors shrink-0"
          >
            <span className="text-xl leading-none">+</span>
            <span>{t("image_add")}</span>
          </button>
        )}
      </div>

      {!canAdd && (
        <p className="text-xs text-gray-400">{t("image_max")}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Surfaced public URLs for parent — hidden from UI */}
      <input type="hidden" value={imageUrls.join(",")} />
    </div>
  );
}
