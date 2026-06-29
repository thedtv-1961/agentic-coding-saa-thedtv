"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { getHashtags, type HashtagResult } from "@/app/actions/kudos/get-hashtags";
import { submitKudos } from "@/app/actions/kudos/submit-kudos";
import KudosRecipientField from "./kudos-recipient-field";
import KudosRichTextEditor from "./kudos-rich-text-editor";
import KudosHashtagField from "./kudos-hashtag-field";
import KudosImageUploadField from "./kudos-image-upload-field";
import KudosAnonymousToggle from "./kudos-anonymous-toggle";

interface VietKudosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** Authenticated user id — required for image uploads */
  userId: string;
}

interface KudosFormState {
  recipientId: string;
  recipientName: string;
  content: string;
  hashtagIds: string[];
  imageFiles: File[];
  imageUrls: string[];
  isAnonymous: boolean;
}

interface FormErrors {
  recipient?: string;
  content?: string;
  hashtag?: string;
}

const EMPTY_FORM: KudosFormState = {
  recipientId: "",
  recipientName: "",
  content: "",
  hashtagIds: [],
  imageFiles: [],
  imageUrls: [],
  isAnonymous: false,
};

function hasData(form: KudosFormState): boolean {
  return (
    !!form.recipientId ||
    !!form.content.trim() ||
    form.hashtagIds.length > 0 ||
    form.imageUrls.length > 0
  );
}

export default function VietKudosModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: VietKudosModalProps) {
  const t = useTranslations("kudos");
  const [form, setForm] = useState<KudosFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hashtags, setHashtags] = useState<HashtagResult[]>([]);

  // Fetch hashtag list once when modal opens
  useEffect(() => {
    if (!isOpen) return;
    getHashtags().then((res) => {
      if ("data" in res) setHashtags(res.data);
    });
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen]);

  // Escape key closes modal (with confirm if dirty)
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, form]);

  const handleClose = useCallback(() => {
    if (hasData(form)) {
      if (!window.confirm("Bạn có muốn hủy lời cảm ơn đang soạn không?")) return;
    }
    onClose();
  }, [form, onClose]);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.recipientId) next.recipient = t("recipient_required");
    if (!form.content.trim()) next.content = t("content_required");
    if (form.hashtagIds.length === 0) next.hashtag = t("hashtag_required");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitKudos({
        receiverId: form.recipientId,
        content: form.content,
        hashtagIds: form.hashtagIds,
        imageUrls: form.imageUrls,
        isAnonymous: form.isAnonymous,
      });

      if ("error" in result) {
        setSubmitError(result.error);
        return;
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gửi thất bại, vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSubmitDisabled =
    isSubmitting ||
    !form.recipientId ||
    !form.content.trim() ||
    form.hashtagIds.length === 0;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="kudos-modal-title"
    >
      <div
        data-testid="kudos-modal"
        className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2
            id="kudos-modal-title"
            className="text-base font-bold text-gray-900 leading-snug"
          >
            {t("modal_title")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("cancel")}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <form
          id="kudos-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5"
        >
          <KudosRecipientField
            recipientId={form.recipientId}
            recipientName={form.recipientName}
            onSelect={(id, name) =>
              setForm((f) => ({ ...f, recipientId: id, recipientName: name }))
            }
            error={errors.recipient}
          />

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">
              {t("content_label")}
              <span className="text-red-500 ml-0.5">*</span>
            </span>
            <KudosRichTextEditor
              value={form.content}
              onChange={(html) => setForm((f) => ({ ...f, content: html }))}
              error={errors.content}
            />
          </div>

          <KudosHashtagField
            value={form.hashtagIds}
            onChange={(ids) => setForm((f) => ({ ...f, hashtagIds: ids }))}
            hashtags={hashtags}
            error={errors.hashtag}
          />

          <KudosImageUploadField
            userId={userId}
            imageUrls={form.imageUrls}
            onUrlsChange={(urls) => setForm((f) => ({ ...f, imageUrls: urls }))}
          />

          <KudosAnonymousToggle
            checked={form.isAnonymous}
            onChange={(val) => setForm((f) => ({ ...f, isAnonymous: val }))}
          />

          {submitError && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {submitError}
            </p>
          )}
        </form>

        {/* Sticky footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 shrink-0 gap-3">
          <button
            type="button"
            data-testid="kudos-cancel-btn"
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="text-base leading-none">×</span>
            {t("cancel")}
          </button>

          <button
            type="submit"
            form="kudos-form"
            data-testid="kudos-submit-btn"
            disabled={isSubmitDisabled}
            className="px-6 py-2 bg-[#FFEA9E] text-[#00101A] rounded-xl text-sm font-bold hover:bg-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
