"use client";

import { useRef, useEffect } from "react";
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

  function execCommand(command: ExecCommandKey, arg?: string) {
    if (command === "createLink") {
      const url = window.prompt("Enter URL:");
      if (!url) return;
      document.execCommand("createLink", false, url);
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
      </div>

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
