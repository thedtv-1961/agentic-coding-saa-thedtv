"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signInAsAdmin } from "@/app/login/actions";

export default function AdminLoginForm() {
  const t = useTranslations("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signInAsAdmin(username, password);
    if (result?.error === "not_admin") {
      setError(t("admin_error_not_admin"));
    } else if (result?.error) {
      setError(t("admin_error_invalid"));
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#00070C] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
            Sun* Awards Admin
          </p>
          <h1 className="text-white text-2xl font-semibold">
            {t("admin_login_title")}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            autoComplete="username"
            placeholder={t("admin_username_placeholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white
              placeholder:text-white/40 focus:outline-none focus:border-[#FFEA9E]/60
              disabled:opacity-50 text-sm"
            disabled={loading}
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder={t("admin_password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white
              placeholder:text-white/40 focus:outline-none focus:border-[#FFEA9E]/60
              disabled:opacity-50 text-sm"
            disabled={loading}
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 px-4 py-3 rounded-lg bg-[#FFEA9E] text-[#00070C] text-sm font-semibold
              hover:bg-[#FFEA9E]/90 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors"
          >
            {loading ? t("admin_login_loading") : t("admin_login_button")}
          </button>
        </form>
      </div>
    </div>
  );
}
