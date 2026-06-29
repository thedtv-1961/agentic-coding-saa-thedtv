"use client";

import { ReactNode } from "react";

interface FabSubButtonProps {
  icon: ReactNode;
  label?: string;
  onClick: () => void;
  variant: "primary" | "secondary" | "cancel";
  animationDelay?: number;
  visible: boolean;
  testId?: string;
}

export default function FabSubButton({
  icon,
  label,
  onClick,
  variant,
  animationDelay = 0,
  visible,
  testId,
}: FabSubButtonProps) {
  const baseClasses =
    "flex items-center gap-2 cursor-pointer select-none transition-all duration-200";

  const variantClasses: Record<FabSubButtonProps["variant"], string> = {
    primary:
      "h-16 px-4 rounded-xl bg-[#FFEA9E] text-[#00101A] shadow-lg justify-start",
    secondary:
      "h-16 px-4 rounded-xl bg-[#FFEA9E] text-[#00101A] shadow-lg justify-start",
    cancel:
      "w-14 h-14 rounded-full bg-[#D4271D] text-white shadow-lg justify-center",
  };

  const widthClass =
    variant === "cancel" ? "w-14" : label ? "min-w-[149px]" : "w-16";

  const animationClass = visible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4 pointer-events-none";

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-label={label}
      style={{ animationDelay: `${animationDelay}ms`, transitionDelay: visible ? `${animationDelay}ms` : "0ms" }}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${animationClass}`}
    >
      <span className="w-6 h-6 shrink-0 flex items-center justify-center">
        {icon}
      </span>
      {label && (
        <span className="text-2xl font-bold font-['Montserrat'] whitespace-nowrap leading-8">
          {label}
        </span>
      )}
    </button>
  );
}
