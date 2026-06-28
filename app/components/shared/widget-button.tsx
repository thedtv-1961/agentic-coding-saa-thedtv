"use client";

export default function WidgetButton() {
  return (
    <button
      type="button"
      onClick={() => {}}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-yellow-400 text-black rounded-full w-[105px] h-16 hover:bg-yellow-300 active:scale-95 transition-all shadow-lg"
      aria-label="Menu"
    >
      {/* Pencil icon */}
      <svg
        className="w-5 h-5 shrink-0"
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
      <span className="text-sm font-bold select-none">/</span>
      <span className="text-sm font-black tracking-tight select-none">SAA</span>
    </button>
  );
}
