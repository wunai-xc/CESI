// src/app/components/Highlight.tsx
// 关键词高亮：把文本里命中搜索词的片段包进 <mark>。
// 支持多个关键词（空格分隔），大小写不敏感；没有关键词时原样输出。

import { Fragment } from "react";

// 把用户输入拆成关键词数组（按空白分隔、去重、忽略大小写）
export function parseTerms(query: string): string[] {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return [...new Set(terms)];
}

// 转义正则里的特殊字符，避免用户输入 "."、"(" 之类把匹配搞崩
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function Highlight({
  text,
  terms,
}: {
  text: string;
  terms: string[];
}) {
  if (terms.length === 0 || !text) return <>{text}</>;

  // 长关键词优先，避免 "react" 先匹配掉 "react compiler" 的一部分导致切分错乱
  const pattern = terms
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");

  const parts = text.split(new RegExp(`(${pattern})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark
            key={index}
            // 方角、不用 rounded；暗色下降低亮度，避免刺眼
            className="bg-yellow-200/80 text-zinc-900 dark:bg-yellow-400/30 dark:text-zinc-50"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
