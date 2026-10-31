// src/app/components/PostToc.tsx
// 文章目录浮层：固定在屏幕左上方的「Contents」按钮，点开列出正文的 h2 / h3，
// 点条目跳转到对应锚点。目录数据由服务端（posts.ts 的 getPostHeadings）算好后传进来。
//
// 按钮半透明，不遮正文；滚动时淡出、停下 400ms 后再出现，避免阅读时被挡。

"use client";

import { useEffect, useState } from "react";
import type { PostHeading } from "@/app/content/posts";

// 滚动停下多久后重新显示按钮（毫秒）
const SHOW_DELAY = 400;

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
  const [hidden, setHidden] = useState(false);

  // 按 Esc 收起，键盘用户不用挪回按钮
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // 滚动中隐藏、停下再显示；只登记一帧，避免滚动时反复 setState
  useEffect(() => {
    if (open) return;

    let frame = 0;
    let timer = 0;

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          setHidden(true);
        });
      }

      window.clearTimeout(timer);
      timer = window.setTimeout(() => setHidden(false), SHOW_DELAY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [open]);

  // 没有小标题的文章不显示这个按钮
  if (headings.length === 0) return null;

  // 面板展开时强制可见，避免滚一下目录就消失
  const invisible = hidden && !open;

  return (
    // top-20 避开顶部导航条
    <div className="fixed left-3 top-20 z-40">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="post-toc"
        title="Contents 目录"
        className={[
          "inline-flex items-center gap-1.5 border border-zinc-300/80 bg-white/55 px-2.5 py-1.5 text-xs text-zinc-700 backdrop-blur-sm transition-all duration-200 hover:border-zinc-400 hover:bg-white/80 hover:text-blue-600 dark:border-zinc-700/80 dark:bg-zinc-900/55 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900/80 dark:hover:text-blue-400",
          invisible ? "pointer-events-none opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <ListIcon />
        <span>Contents</span>
      </button>

      {open ? (
        <nav
          id="post-toc"
          aria-label="Table of contents"
          className="mt-2 max-h-[60svh] w-64 overflow-y-auto border border-zinc-200 bg-white/85 py-1 text-sm shadow-lg backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/85"
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
