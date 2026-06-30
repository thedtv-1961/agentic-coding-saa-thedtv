"use client";

import { useRef, useState, useEffect } from "react";
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

  // Sync uploaded public URLs to parent whenever entries change
  useEffect(() => {
    const uploaded = entries
      .filter((e) => e.publicUrl !== null && !e.uploading)
      .map((e) => e.publicUrl as string);
    onUrlsChange(uploaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

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
            updated[idx] = { ...updated[idx], publicUrl: url, uploading: false };
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
      return prev.filter((_, i) => i !== idx);
    });
  }

  const canAdd = entries.length < MAX_KUDOS_IMAGES;

  return (
    <div className="flex flex-row items-start gap-4">
      <span className="text-[22px] font-bold text-[#00101A] w-36 shrink-0 pt-2 leading-tight">
        {t("image_label")}
        <span className="text-xs font-normal text-gray-400 ml-1">
          ({entries.length}/{MAX_KUDOS_IMAGES})
        </span>
      </span>

      <div className="flex-1 flex flex-col gap-2">
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
            className="inline-flex items-center gap-2 px-2 h-12 border border-[#998C5F] bg-white text-gray-900 text-[11px] font-bold rounded-lg hover:border-yellow-500 hover:text-yellow-600 transition-colors tracking-[0.5px] shrink-0"
          >
            <span className="text-lg leading-none">+</span>
            <span className="flex flex-col items-start">
              <span>{t("image_add")}</span>
              <span className="text-[9px] font-normal opacity-60">{t("image_max")}</span>
            </span>
          </button>
        )}
      </div>

      {!canAdd && (
        <p className="text-xs text-gray-400">{t("image_max")}</p>
      )}
      </div>

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
