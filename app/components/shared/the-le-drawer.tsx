"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import TheLEContent from "./the-le-content";

interface TheLEDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onWriteKudos: () => void;
}

export default function TheLEDrawer({ isOpen, onClose, onWriteKudos }: TheLEDrawerProps) {
  const t = useTranslations("drawer");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus close button when drawer opens
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[59] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("the_le_title")}
        data-testid="the-le-drawer"
        className={`fixed inset-y-0 right-0 w-[553px] max-w-[95vw] bg-[#00070C] z-[60] flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <TheLEContent />
        </div>

        {/* Sticky footer */}
        <div className="flex-shrink-0 border-t border-white/10 bg-[#00070C] px-6 py-4 flex gap-3">
          <button
            ref={closeButtonRef}
            data-testid="drawer-close-btn"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 text-white
              hover:bg-white/10 transition-colors text-sm font-medium"
          >
            {/* X icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {t("close")}
          </button>

          <button
            data-testid="drawer-write-kudos-btn"
            onClick={onWriteKudos}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFEA9E] text-gray-900
              hover:bg-yellow-300 transition-colors text-sm font-semibold flex-1 justify-center"
          >
            {/* Pen icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            {t("write_kudos")}
          </button>
        </div>
      </div>
    </>
  );
}
