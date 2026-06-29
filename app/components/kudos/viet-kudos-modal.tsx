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
  title: string;
  content: string;
  hashtagIds: string[];
  imageFiles: File[];
  imageUrls: string[];
  isAnonymous: boolean;
}

interface FormErrors {
  recipient?: string;
  title?: string;
  content?: string;
  hashtag?: string;
}

const EMPTY_FORM: KudosFormState = {
  recipientId: "",
  recipientName: "",
  title: "",
  content: "",
  hashtagIds: [],
  imageFiles: [],
  imageUrls: [],
  isAnonymous: false,
};

function hasData(form: KudosFormState): boolean {
  return (
    !!form.recipientId ||
    !!form.title.trim() ||
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

  useEffect(() => {
    if (!isOpen) return;
    getHashtags().then((res) => {
      if ("data" in res) setHashtags(res.data);
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen]);

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
    if (!form.title.trim()) next.title = t("title_required");
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
        title: form.title,
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
    !form.title.trim() ||
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
        className="bg-[#FFF8E1] rounded-3xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col shadow-2xl relative"
      >
        {/* Close button — absolute top-right */}
        <button
          type="button"
          onClick={handleClose}
          aria-label={t("cancel")}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-full hover:bg-black/10 transition-colors text-2xl leading-none z-10"
        >
          ×
        </button>

        {/* Centered title */}
        <h2
          id="kudos-modal-title"
          className="text-[28px] font-bold text-[#00101A] text-center px-16 pt-10 pb-0 shrink-0 leading-tight"
        >
          {t("modal_title")}
        </h2>

        {/* Scrollable form body */}
        <form
          id="kudos-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-10 py-6 flex flex-col gap-6"
        >
          <KudosRecipientField
            recipientId={form.recipientId}
            recipientName={form.recipientName}
            onSelect={(id, name) =>
              setForm((f) => ({ ...f, recipientId: id, recipientName: name }))
            }
            error={errors.recipient}
          />

          {/* Danh hiệu */}
          <div className="flex flex-row items-center gap-4">
            <label
              htmlFor="kudos-title"
              className="text-[22px] font-bold text-[#00101A] shrink-0 w-36 leading-tight"
            >
              {t("title_label")}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex-1 flex flex-col gap-1">
              <input
                id="kudos-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder={t("title_placeholder")}
                maxLength={100}
                data-testid="kudos-title-input"
                className={`w-full h-14 border rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  errors.title ? "border-red-500" : "border-[#998C5F]"
                }`}
              />
              <p className="text-xs text-gray-400">{t("title_hint")}</p>
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>
          </div>

          <KudosRichTextEditor
            value={form.content}
            onChange={(html) => setForm((f) => ({ ...f, content: html }))}
            error={errors.content}
          />

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

        {/* Footer — no border separator */}
        <div className="flex items-center px-10 pb-10 pt-2 shrink-0 gap-4">
          <button
            type="button"
            data-testid="kudos-cancel-btn"
            onClick={handleClose}
            className="flex items-center gap-2 px-5 py-3 border border-gray-400 rounded-xl text-sm font-medium text-gray-700 hover:bg-black/5 transition-colors"
          >
            <span className="text-base leading-none">×</span>
            {t("cancel")}
          </button>

          <button
            type="submit"
            form="kudos-form"
            data-testid="kudos-submit-btn"
            disabled={isSubmitDisabled}
            className="flex-1 py-3 bg-[#FFEA9E] text-[#00101A] rounded-xl text-sm font-bold hover:bg-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
