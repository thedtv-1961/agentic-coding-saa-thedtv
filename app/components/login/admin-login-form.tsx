"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signInAsAdmin } from "@/app/login/actions";

export default function AdminLoginForm() {
  const t = useTranslations("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signInAsAdmin(email, password);
    // result chỉ có khi có lỗi — redirect xảy ra bên trong action nếu thành công
    if (result?.error === "not_admin") {
      setError(t("admin_error_not_admin"));
    } else if (result?.error) {
      setError(t("admin_error_invalid"));
    }
    setLoading(false);
  }

  return (
    <div className="mt-6 w-fit">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
        {t("admin_login_title")}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-72">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder={t("admin_email_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white text-sm
            placeholder:text-white/40 focus:outline-none focus:border-[#FFEA9E]/60
            disabled:opacity-50"
          disabled={loading}
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder={t("admin_password_placeholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white text-sm
            placeholder:text-white/40 focus:outline-none focus:border-[#FFEA9E]/60
            disabled:opacity-50"
          disabled={loading}
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-[#FFEA9E]/20 border border-[#FFEA9E]/40
            text-[#FFEA9E] text-sm font-medium hover:bg-[#FFEA9E]/30
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? t("admin_login_loading") : t("admin_login_button")}
        </button>
      </form>
    </div>
  );
}
