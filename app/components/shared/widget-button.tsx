"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import FabSubButton from "./fab-sub-button";

// SVG icon: Pencil
function PenIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}

function SaaLogoIcon() {
  return (
    <Image
      src="/images/saa-logo.png"
      alt="SAA"
      width={20}
      height={19}
      aria-hidden="true"
    />
  );
}

// SVG icon: Close (×)
function CloseIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export interface FloatingActionButtonProps {
  isExpanded?: boolean;
  onToggle?: () => void;
  onRulesClick?: () => void;
  onWriteKudosClick?: () => void;
}

export default function WidgetButton({
  isExpanded: controlledExpanded,
  onToggle,
  onRulesClick,
  onWriteKudosClick,
}: FloatingActionButtonProps = {}) {
  const t = useTranslations("fab");

  // Support both controlled and uncontrolled usage
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const fabRef = useRef<HTMLDivElement>(null);

  function handleToggle() {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  }

  function handleCollapse() {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded(false);
    }
  }

  function handleRulesClick() {
    handleCollapse();
    onRulesClick?.();
  }

  function handleWriteKudosClick() {
    handleCollapse();
    onWriteKudosClick?.();
  }

  // Click-outside to collapse
  useEffect(() => {
    if (!isExpanded) return;

    function handleClickOutside(event: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        handleCollapse();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  return (
    <div
      ref={fabRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-5"
      aria-label={t("menu_label")}
    >
      {/* Sub-buttons (shown when expanded) — ordered top-to-bottom: Thể lệ, Viết KUDOS, Cancel */}
      <div className="flex flex-col items-end gap-5">
        <FabSubButton
          icon={<SaaLogoIcon />}
          label={t("rules_label")}
          onClick={handleRulesClick}
          variant="secondary"
          animationDelay={0}
          visible={isExpanded}
          testId="fab-rules"
        />
        <FabSubButton
          icon={<PenIcon />}
          label={t("write_kudos_label")}
          onClick={handleWriteKudosClick}
          variant="primary"
          animationDelay={100}
          visible={isExpanded}
          testId="fab-write-kudos"
        />
        <FabSubButton
          icon={<CloseIcon />}
          onClick={handleCollapse}
          variant="cancel"
          animationDelay={200}
          visible={isExpanded}
          testId="fab-cancel"
        />
      </div>

      {/* Collapsed button — hidden when expanded */}
      {!isExpanded && <button
        type="button"
        onClick={handleToggle}
        data-testid="fab-collapsed"
        aria-label={t("menu_label")}
        aria-expanded={isExpanded}
        className="flex items-center justify-center gap-2 bg-[#FFEA9E] text-[#00101A] rounded-full w-[106px] h-16 hover:bg-yellow-300 active:scale-95 transition-all shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
      >
        <PenIcon />
        <span className="text-base font-bold select-none font-['Montserrat']">/</span>
        <SaaLogoIcon />
      </button>}
    </div>
  );
}
