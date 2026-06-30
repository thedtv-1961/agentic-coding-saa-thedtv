"use client";

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center px-6">
        <h2 className="text-2xl font-bold mb-4">Có lỗi xảy ra</h2>
        <p className="text-white/60 mb-6 text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2 border border-white/40 text-sm hover:bg-white/10 transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
