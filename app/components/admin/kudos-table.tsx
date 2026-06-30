"use client";

import React, { useTransition, useState } from "react";
import Link from "next/link";
import { deleteKudos } from "@/app/actions/admin/delete-kudos";

interface HashtagItem {
  hashtags: { name: string } | null;
}

interface KudosRow {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_anonymous: boolean;
  sender: { full_name: string } | null;
  receiver: { full_name: string } | null;
  kudos_hashtags: HashtagItem[];
  kudos_images: { id: string }[];
}

interface KudosTableProps {
  rows: KudosRow[];
  page: number;
  totalPages: number;
}

export function KudosTable({ rows, page, totalPages }: KudosTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this kudos? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteKudos(id);
      } catch {
        alert("Failed to delete kudos. Please try again.");
      } finally {
        setDeletingId(null);
      }
    });
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (rows.length === 0) {
    return (
      <div className="text-white/50 text-center py-16">No kudos found.</div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm text-white/80">
          <thead>
            <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Sender</th>
              <th className="px-4 py-3 text-left">Receiver</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Anon</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => {
              const isExpanded = expandedId === row.id;
              const isDeleting = deletingId === row.id && isPending;
              const senderName = row.is_anonymous
                ? "Ẩn danh"
                : (row.sender?.full_name ?? "—");
              const hashtags = row.kudos_hashtags
                .map((h) => h.hashtags?.name)
                .filter(Boolean) as string[];

              return (
                <React.Fragment key={row.id}>
                  <tr
                    className={`cursor-pointer transition-colors hover:bg-white/5 ${
                      isExpanded ? "bg-white/5" : ""
                    } ${isDeleting ? "opacity-40" : ""}`}
                    onClick={() => toggleExpand(row.id)}
                  >
                    <td className="px-4 py-3 font-mono text-white/40 text-xs">
                      {row.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 font-medium text-white max-w-[180px] truncate">
                      {row.title}
                    </td>
                    <td className="px-4 py-3">
                      {row.is_anonymous ? (
                        <span className="text-white/40 italic">Ẩn danh</span>
                      ) : (
                        senderName
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.receiver?.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-white/50 whitespace-nowrap">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      {row.is_anonymous && (
                        <span className="inline-block px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          Anon
                        </span>
                      )}
                    </td>
                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleDelete(row.id)}
                        disabled={isDeleting}
                        className="px-3 py-1 rounded text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-white/[0.03]">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs text-white/40 uppercase tracking-wider">
                              Content
                            </span>
                            <p className="mt-1 text-white/80 text-sm leading-relaxed">
                              {row.content}
                            </p>
                          </div>

                          <div className="flex gap-6">
                            <div>
                              <span className="text-xs text-white/40 uppercase tracking-wider">
                                Hashtags
                              </span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {hashtags.length > 0 ? (
                                  hashtags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-block px-2 py-0.5 rounded-full text-xs bg-[#FFEA9E]/10 text-[#FFEA9E] border border-[#FFEA9E]/20"
                                    >
                                      #{tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-white/30 text-xs">None</span>
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="text-xs text-white/40 uppercase tracking-wider">
                                Images
                              </span>
                              <p className="mt-1 text-white/70 text-sm">
                                {row.kudos_images.length} image
                                {row.kudos_images.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-white/50">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}`}
                className="px-4 py-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
              >
                ← Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}`}
                className="px-4 py-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
