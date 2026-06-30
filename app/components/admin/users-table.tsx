"use client";

import { useTransition, useState } from "react";
import Image from "next/image";
import { toggleUserRole } from "@/app/actions/admin/toggle-user-role";

type HeroLevel = "new_hero" | "rising_hero" | "super_hero" | "legend_hero";

interface UserRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  hero_level: string | null;
  created_at: string | null;
}

interface Props {
  rows: UserRow[];
  currentUserId: string;
}

const HERO_LEVEL_BADGE: Record<HeroLevel, string> = {
  new_hero: "bg-white/10 text-white/60",
  rising_hero: "bg-green-500/20 text-green-300 border border-green-500/30",
  super_hero: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  legend_hero: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
};

const HERO_LEVEL_LABEL: Record<HeroLevel, string> = {
  new_hero: "New Hero",
  rising_hero: "Rising Hero",
  super_hero: "Super Hero",
  legend_hero: "Legend Hero",
};

function isHeroLevel(val: string | null): val is HeroLevel {
  return val !== null && val in HERO_LEVEL_BADGE;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AvatarCell({ avatarUrl, fullName }: { avatarUrl: string | null; fullName: string | null }) {
  const initial = (fullName ?? "?")[0].toUpperCase();

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={fullName ?? "User avatar"}
        width={32}
        height={32}
        className="rounded-full"
        unoptimized
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold text-white select-none">
      {initial}
    </div>
  );
}

function RoleBadge({ role }: { role: string | null }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FFEA9E]/20 text-[#FFEA9E] border border-[#FFEA9E]/30">
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white/60">
      User
    </span>
  );
}

function HeroLevelBadge({ level }: { level: string | null }) {
  if (!isHeroLevel(level)) {
    return <span className="text-white/40 text-xs">—</span>;
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${HERO_LEVEL_BADGE[level]}`}>
      {HERO_LEVEL_LABEL[level]}
    </span>
  );
}

function ToggleRoleButton({
  row,
  isSelf,
}: {
  row: UserRow;
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleToggle() {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await toggleUserRole(row.id);
      } catch (err) {
        setErrorMsg(
          err instanceof Error ? err.message : "Đổi role thất bại. Thử lại."
        );
      }
    });
  }

  const label = row.role === "admin" ? "→ User" : "→ Admin";

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isSelf || isPending}
        title={isSelf ? "Không thể đổi role của bản thân" : undefined}
        className={[
          "px-3 py-1 rounded text-xs font-medium transition-colors",
          isSelf
            ? "bg-white/5 text-white/25 cursor-not-allowed"
            : "bg-white/10 text-white/80 hover:bg-white/20 disabled:opacity-50 disabled:cursor-wait",
        ].join(" ")}
      >
        {isPending ? "..." : label}
      </button>
      {errorMsg && (
        <span className="text-red-400 text-xs">{errorMsg}</span>
      )}
    </div>
  );
}

export default function UsersTable({ rows, currentUserId }: Props) {
  if (rows.length === 0) {
    return <p className="text-white/50 text-sm">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-4 py-3 text-left text-white/60 font-medium">Avatar</th>
            <th className="px-4 py-3 text-left text-white/60 font-medium">Name</th>
            <th className="px-4 py-3 text-left text-white/60 font-medium">Role</th>
            <th className="px-4 py-3 text-left text-white/60 font-medium">Hero Level</th>
            <th className="px-4 py-3 text-left text-white/60 font-medium">Joined</th>
            <th className="px-4 py-3 text-left text-white/60 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isSelf = row.id === currentUserId;
            return (
              <tr
                key={row.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors last:border-0"
              >
                <td className="px-4 py-3">
                  <AvatarCell avatarUrl={row.avatar_url} fullName={row.full_name} />
                </td>
                <td className="px-4 py-3 text-white/90">
                  {row.full_name ?? <span className="text-white/40 italic">Unnamed</span>}
                  {isSelf && (
                    <span className="ml-2 text-[10px] text-white/40">(you)</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={row.role} />
                </td>
                <td className="px-4 py-3">
                  <HeroLevelBadge level={row.hero_level} />
                </td>
                <td className="px-4 py-3 text-white/50 tabular-nums">
                  {formatDate(row.created_at)}
                </td>
                <td className="px-4 py-3">
                  <ToggleRoleButton row={row} isSelf={isSelf} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
