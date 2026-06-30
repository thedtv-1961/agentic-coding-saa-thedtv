"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/actions/auth/logout";

interface Props {
  isAdmin: boolean;
  userAvatarUrl?: string | null;
}

export default function ProfileDropdown({ isAdmin, userAvatarUrl }: Props) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleLogout() {
    setIsOpen(false);
    startTransition(() => logout());
  }

  const isDashboardActive = pathname === "/admin" || pathname.startsWith("/admin/");

  const itemBase =
    "flex items-center justify-between w-full px-4 py-3 text-sm text-white transition-colors cursor-pointer";
  const itemHover = "hover:bg-white/10";
  const itemActive = "bg-white/10 shadow-[0_0_8px_rgba(250,226,135,0.15)]";

  return (
    <div ref={dropdownRef} className="relative">
      {/* Avatar trigger */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t("account_label")}
        type="button"
        className="flex items-center focus:outline-none"
      >
        {userAvatarUrl ? (
          <Image
            src={userAvatarUrl}
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full"
            unoptimized
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <UserIcon />
          </div>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div role="menu" className="absolute top-full right-0 mt-2 min-w-[160px] bg-[#0d1117] rounded-xl border border-white/10 shadow-xl z-50">
          {/* Profile — no-op for all users (page not implemented) */}
          <button
            role="menuitem"
            type="button"
            onClick={() => setIsOpen(false)}
            className={`${itemBase} ${itemHover} rounded-t-xl`}
          >
            <span>{t("dropdown_profile")}</span>
            <UserIcon className="ml-3 w-4 h-4 text-white/60" />
          </button>

          {/* Dashboard — admin only */}
          {isAdmin && (
            <Link
              role="menuitem"
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`${itemBase} ${itemHover} ${isDashboardActive ? itemActive : ""}`}
            >
              <span>{t("dropdown_dashboard")}</span>
              <GridIcon className="ml-3 w-4 h-4 text-white/60" />
            </Link>
          )}

          {/* Divider */}
          <div className="h-px bg-white/10 mx-3" />

          {/* Logout */}
          <button
            role="menuitem"
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className={`${itemBase} ${itemHover} rounded-b-xl disabled:opacity-50`}
          >
            <span>{t("dropdown_logout")}</span>
            <LogoutIcon className="ml-3 w-4 h-4 text-white/60" />
          </button>
        </div>
      )}
    </div>
  );
}

function UserIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function GridIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function LogoutIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
