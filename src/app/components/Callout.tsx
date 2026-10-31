// src/app/components/Callout.tsx
// MDX 正文里的提示块（<Callout type="info|warn|danger">），配色按类型走 styles 表。

import type { ReactNode } from "react";

type CalloutType = "info" | "warn" | "danger";

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children?: ReactNode;
};

// 三种类型的边框 / 背景 / 文字色，亮色与暗色各一套
const styles: Record<CalloutType, string> = {
  info: "border-line bg-panel text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
  warn: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100",
  danger:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
};

export default function Callout({
  type = "info",
  title,
  children,
}: CalloutProps) {
  return (
    <aside className={`not-prose my-6 border px-4 py-3 text-sm leading-6 ${styles[type]}`}>
      {/* 可选标题 */}
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      {/* 正文：清掉 prose 的段落间距，多个子元素之间统一留 8px */}
      <div className="[&>*+*]:mt-2 [&_p]:m-0">{children}</div>
    </aside>
  );
}
