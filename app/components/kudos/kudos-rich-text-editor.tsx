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

interface ToolbarButton {
  label: string;
  command: ExecCommandKey;
  arg?: string;
  title: string;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  { label: "B", command: "bold", title: "Bold" },
  { label: "I", command: "italic", title: "Italic" },
  { label: "S", command: "strikeThrough", title: "Strikethrough" },
  { label: "1.", command: "insertOrderedList", title: "Ordered List" },
  { label: "🔗", command: "createLink", title: "Link" },
  { label: "❝", command: "formatBlock", arg: "blockquote", title: "Quote" },
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

  // Sync external value into editor only on mount (avoid cursor jumping)
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
      <div className="flex items-center gap-1 border border-gray-200 rounded-t-lg px-2 py-1 bg-gray-50">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.command + (btn.arg ?? "")}
            type="button"
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault(); // keep focus in editor
              execCommand(btn.command, btn.arg);
            }}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
              btn.label === "B" ? "font-bold" : ""
            } ${btn.label === "I" ? "italic" : ""} ${
              btn.label === "S" ? "line-through" : ""
            }`}
          >
            {btn.label}
          </button>
        ))}
        <a
          href="#"
          className="ml-auto text-xs text-blue-500 hover:underline whitespace-nowrap"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("community_standards")}
        </a>
      </div>

      {linkDialogOpen && (
        <div className="flex items-center gap-2 border border-gray-300 bg-white rounded-lg px-3 py-2 shadow-sm">
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
            className="flex-1 text-sm outline-none min-w-0"
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
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            ×
          </button>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-testid="kudos-content"
        data-placeholder={t("content_placeholder")}
        className={`min-h-[120px] border rounded-b-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm text-gray-800 ${
          error ? "border-red-500" : "border-gray-200"
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
