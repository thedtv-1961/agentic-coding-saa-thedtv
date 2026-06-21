"use client";

import { useState } from "react";
import Image from "next/image";
import { signInWithGoogle } from "@/app/login/actions";

interface LoginButtonProps {
  label: string;
}

export default function LoginButton({ label }: LoginButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await signInWithGoogle();
    // loading stays true — signInWithGoogle redirects on success
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-gray-900
        bg-[#e8d5a3] hover:bg-[#f0e0b0] hover:shadow-lg
        disabled:opacity-70 disabled:cursor-not-allowed
        transition-all duration-150 w-fit cursor-pointer"
    >
      {loading ? (
        <svg
          className="w-5 h-5 animate-spin text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <Image
          src="/icons/google-logo.svg"
          alt="Google"
          width={20}
          height={20}
          unoptimized
        />
      )}
      <span>{label}</span>
    </button>
  );
}
