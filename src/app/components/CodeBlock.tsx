// src/app/components/CodeBlock.tsx
// MDX 代码块外壳：顶部信息栏（文件名 / 运行环境与版本 / 语言与版本）+ 复制按钮，下面是高亮后的代码。
// 高亮本身由 rehype-highlight 在编译期完成，这里只负责外壳与复制交互，不引入客户端高亮库。

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

// 取子元素（<code>）的 className，用来从 language-xxx 里读语言
function classNameOf(children: ReactNode) {
  const child = Array.isArray(children) ? children[0] : children;
  if (!isValidElement<{ className?: string }>(child)) return "";
  return child.props.className ?? "";
}

// 语言标识（ts / bash / json ...）转成显示名；显式传入 language 时优先用它
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
  // 默认单行不换行（横向滚动），点按钮可切换成自动换行
  const [wrap, setWrap] = useState(false);

  // 信息栏要显示的三段文字，缺哪段就不渲染哪段
  const languageLabel = languageOf(children, language);
  const runtimeLabel = [runtime, runtimeVersion].filter(Boolean).join(" ");
  const languageLabelWithVersion = [languageLabel, languageVersion]
    .filter(Boolean)
    .join(" ");

  // 复制：直接从 DOM 里取 <code> 的纯文本，避免和 React 子节点结构耦合
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
      {/* 信息栏 */}
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
        <div className="flex shrink-0 items-center gap-1.5">
          {/* 换行开关：单行（横向滚动）↔ 自动换行 */}
          <button
            type="button"
            onClick={() => setWrap((value) => !value)}
            aria-pressed={wrap}
            aria-label={wrap ? "Nowrap code" : "Wrap code"}
            title={wrap ? "单行显示" : "换行显示"}
            className="border border-zinc-300 px-2 py-0.5 text-xs transition-colors hover:border-zinc-400 hover:text-zinc-800 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
          >
            {wrap ? "Nowrap" : "Wrap"}
          </button>
          <button
            type="button"
            onClick={copyCode}
            aria-label="Copy code"
            className="border border-zinc-300 px-2 py-0.5 text-xs transition-colors hover:border-zinc-400 hover:text-zinc-800 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      {/* 代码正文：children 是 rehype-highlight 处理过的 <code> */}
      <div
        ref={bodyRef}
        className={[
          "bg-zinc-50 px-4 py-3 text-[13px] leading-6 dark:bg-zinc-950",
          // 单行模式：横向滚动、不折行；换行模式：软换行，长行不产生横向滚动
          wrap ? "overflow-x-hidden" : "overflow-x-auto",
        ].join(" ")}
      >
        <pre
          className={[
            "font-mono",
            wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
          ].join(" ")}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}
