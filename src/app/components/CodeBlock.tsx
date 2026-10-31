"use client";

import { isValidElement, useRef, useState, type ReactNode } from "react";

type CodeBlockProps = {
  children?: ReactNode;
  filename?: string;
  language?: string;
  languageVersion?: string;
  runtime?: string;
  runtimeVersion?: string;
};

function classNameOf(children: ReactNode) {
  const child = Array.isArray(children) ? children[0] : children;
  if (!isValidElement<{ className?: string }>(child)) return "";
  return child.props.className ?? "";
}

function languageOf(children: ReactNode, language?: string) {
  const raw =
    language ?? /language-([\w+#.-]+)/.exec(classNameOf(children))?.[1] ?? "";
  if (!raw) return "";
  const names: Record<string, string> = {
    ts: "TypeScript",
    tsx: "TSX",
    js: "JavaScript",
    jsx: "JSX",
    mjs: "JavaScript",
    cjs: "JavaScript",
    sh: "Shell",
    bash: "Bash",
    zsh: "Zsh",
    json: "JSON",
    css: "CSS",
    html: "HTML",
    md: "Markdown",
    mdx: "MDX",
    py: "Python",
    rs: "Rust",
    go: "Go",
    yml: "YAML",
    yaml: "YAML",
    txt: "Text",
  };
  return names[raw.toLowerCase()] ?? raw;
}

export default function CodeBlock({
  children,
  filename,
  language,
  languageVersion,
  runtime,
  runtimeVersion,
}: CodeBlockProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const languageLabel = languageOf(children, language);
  const runtimeLabel = [runtime, runtimeVersion].filter(Boolean).join(" ");
  const languageLabelWithVersion = [languageLabel, languageVersion]
    .filter(Boolean)
    .join(" ");

  async function copyCode() {
    const text = bodyRef.current?.querySelector("code")?.textContent ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="not-prose my-6 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          {filename ? (
            <span className="truncate font-mono text-zinc-700 dark:text-zinc-200">
              {filename}
            </span>
          ) : null}
          {runtimeLabel ? <span>{runtimeLabel}</span> : null}
          {languageLabelWithVersion ? (
            <span>{languageLabelWithVersion}</span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={copyCode}
          aria-label="复制代码"
          className="shrink-0 border border-zinc-300 px-2 py-0.5 text-xs transition-colors hover:border-zinc-400 hover:text-zinc-800 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
        >
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <div
        ref={bodyRef}
        className="overflow-x-auto bg-zinc-50 px-4 py-3 text-[13px] leading-6 dark:bg-zinc-950"
      >
        <pre className="font-mono">{children}</pre>
      </div>
    </div>
  );
}
