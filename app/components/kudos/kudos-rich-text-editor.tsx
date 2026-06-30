"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface KudosRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  error?: string;
}

const MAX_CHARS = 1000;

type ExecCommandKey = "bold" | "italic" | "strikeThrough" | "insertOrderedList" | "createLink" | "formatBlock";

// Inline SVG icons — no library dependency
function IconList() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <rect x="0" y="1" width="2.5" height="2.5" rx="0.5"/>
      <rect x="4.5" y="1.5" width="9.5" height="1.5" rx="0.5"/>
      <rect x="0" y="5.75" width="2.5" height="2.5" rx="0.5"/>
      <rect x="4.5" y="6.25" width="9.5" height="1.5" rx="0.5"/>
      <rect x="0" y="10.5" width="2.5" height="2.5" rx="0.5"/>
      <rect x="4.5" y="11" width="9.5" height="1.5" rx="0.5"/>
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 9.5a4 4 0 0 0 5.656 0l2-2a4 4 0 0 0-5.656-5.656L7 3.5"/>
      <path d="M9.5 6.5a4 4 0 0 0-5.656 0l-2 2a4 4 0 0 0 5.656 5.656L9 13"/>
    </svg>
  );
}

function IconQuote() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 14" fill="currentColor" aria-hidden="true">
      <path d="M2.5 0A2.5 2.5 0 0 0 0 2.5v3A2.5 2.5 0 0 0 2.5 8H4L3 12h2.5L7 7V0H2.5z"/>
      <path d="M10.5 0A2.5 2.5 0 0 0 8 2.5v3A2.5 2.5 0 0 0 10.5 8H12L11 12h2.5L15 7V0h-4.5z"/>
    </svg>
  );
}

interface ToolbarItem {
  icon: React.ReactNode;
  command: ExecCommandKey;
  arg?: string;
  title: string;
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { icon: <span className="font-bold font-serif text-[15px] leading-none">B</span>, command: "bold", title: "Bold" },
  { icon: <span className="italic font-serif text-[15px] leading-none">I</span>, command: "italic", title: "Italic" },
  { icon: <span className="line-through text-[15px] leading-none">S</span>, command: "strikeThrough", title: "Strikethrough" },
  { icon: <IconList />, command: "insertOrderedList", title: "Ordered List" },
  { icon: <IconLink />, command: "createLink", title: "Link" },
  { icon: <IconQuote />, command: "formatBlock", arg: "blockquote", title: "Quote" },
];

export default function KudosRichTextEditor({
  value,
  onChange,
  error,
}: KudosRichTextEditorProps) {
  const t = useTranslations("kudos");
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getTextLength(): number {
    if (!editorRef.current) return 0;
    return editorRef.current.innerText.replace(/\n/g, "").length;
  }

  function handleInput() {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  }

  function saveSelection(): Range | null {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) return sel.getRangeAt(0).cloneRange();
    return null;
  }

  function restoreSelection(range: Range | null) {
    if (!range) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function handleLinkSubmit() {
    const url = linkUrl.trim();
    if (!url) return;
    restoreSelection(savedRangeRef.current);
    document.execCommand("createLink", false, url);
    editorRef.current?.focus();
    handleInput();
    setLinkDialogOpen(false);
    setLinkUrl("");
    savedRangeRef.current = null;
  }

  function execCommand(command: ExecCommandKey, arg?: string) {
    if (command === "createLink") {
      savedRangeRef.current = saveSelection();
      setLinkDialogOpen(true);
      return;
    } else if (arg) {
      document.execCommand(command, false, arg);
    } else {
      document.execCommand(command, false);
    }
    editorRef.current?.focus();
    handleInput();
  }

  const charCount = editorRef.current
    ? editorRef.current.innerText.replace(/\n/g, "").length
    : 0;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="flex flex-col gap-1">
      {/* Toolbar */}
      <div className={`flex items-center gap-0.5 border rounded-t-lg px-2 py-1.5 bg-[#FFF8E1] ${error ? "border-red-500" : "border-[#998C5F]/40"}`}>
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.command + (item.arg ?? "")}
            type="button"
            title={item.title}
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand(item.command, item.arg);
            }}
            className="w-8 h-7 flex items-center justify-center rounded hover:bg-black/10 transition-colors text-[#00101A]"
          >
            {item.icon}
          </button>
        ))}
        <a
          href="#"
          className="ml-auto text-xs text-[#D4271D] hover:underline whitespace-nowrap"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("community_standards")}
        </a>
      </div>

      {linkDialogOpen && (
        <div className="flex items-center gap-2 border border-[#998C5F]/40 bg-[#FFF8E1] rounded-lg px-3 py-2 shadow-sm">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleLinkSubmit(); }
              if (e.key === "Escape") { setLinkDialogOpen(false); setLinkUrl(""); }
            }}
            placeholder="https://..."
            autoFocus
            className="flex-1 text-sm outline-none min-w-0 bg-transparent"
          />
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleLinkSubmit(); }}
            className="text-xs px-2 py-1 bg-yellow-400 rounded text-gray-800 font-medium hover:bg-yellow-300 transition-colors shrink-0"
          >
            Áp dụng
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setLinkDialogOpen(false); setLinkUrl(""); }}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors shrink-0"
          >
            ×
          </button>
        </div>
      )}

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-testid="kudos-content"
        data-placeholder={t("content_placeholder")}
        className={`min-h-[120px] border-x border-b rounded-b-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm text-gray-800 bg-white ${
          error ? "border-red-500" : "border-[#998C5F]/40"
        } [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:pointer-events-none`}
      />

      {/* Footer: hint + char counter */}
      <div className="flex items-center justify-between text-xs mt-0.5">
        <span className="text-gray-400">{t("content_hint")}</span>
        <span className={isOverLimit ? "text-red-500 font-medium" : "text-gray-400"}>
          {getTextLength()}/{MAX_CHARS}
        </span>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
