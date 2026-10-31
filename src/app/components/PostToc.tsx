// src/app/components/PostToc.tsx
// 文章目录浮层：固定在屏幕左上方的「Contents」按钮，点开列出正文的 h2 / h3，
// 点条目跳转到对应锚点。目录数据由服务端（posts.ts 的 getPostHeadings）算好后传进来，
// 这里只负责展开/收起和滚动定位。

"use client";

import { useEffect, useState } from "react";
import type { PostHeading } from "@/app/content/posts";

function ListIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export default function PostToc({ headings }: { headings: PostHeading[] }) {
  const [open, setOpen] = useState(false);

  // 按 Esc 收起，键盘用户不用挪回按钮
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // 没有小标题的文章不显示这个按钮
  if (headings.length === 0) return null;

  return (
    // top-20 避开顶部导航条；pointer-events 只作用在自身，不影响页面其它区域
    <div className="fixed left-3 top-20 z-40">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="post-toc"
        title="Contents 目录"
        className="inline-flex items-center gap-1.5 border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-600 shadow-sm transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
      >
        <ListIcon />
        <span>Contents</span>
      </button>

      {open ? (
        <nav
          id="post-toc"
          aria-label="Table of contents"
          className="mt-2 max-h-[60svh] w-64 overflow-y-auto border border-zinc-200 bg-white py-1 text-sm shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
        >
          <ul>
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={() => setOpen(false)}
                  className={[
                    "block px-3 py-1.5 leading-5 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-blue-400",
                    // 三级标题缩进，形成层级
                    heading.depth === 3 ? "pl-6" : "",
                  ].join(" ")}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
