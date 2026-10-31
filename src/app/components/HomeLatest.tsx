// src/app/components/HomeLatest.tsx
// 首页第二段：最近更新。用等宽序号 + 标题 + 日期的列表，滚动进入时上浮淡入。
// 数据由服务端传入（构建期算好）。

import Link from "next/link";
import { formatDate } from "@/app/lib/formatDate";
import type { Post } from "@/app/content/posts";

export default function HomeLatest({
  posts,
  totalWords,
}: {
  posts: Post[];
  totalWords: number;
}) {
  // 首页只展示最近三篇
  const latest = posts.slice(0, 3);

  return (
    <section className="relative border-t border-zinc-200 bg-white px-6 py-20 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="scroll-reveal mx-auto w-full max-w-3xl">
        {/* 段落头：等宽小标 + 标题 + 右侧统计 */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
              01 / latest
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              All posts
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
            {posts.length} posts · {totalWords.toLocaleString()} words
          </p>
        </div>

        {/* 文章列表：序号 + 标题 + 日期，悬停整行变蓝 */}
        <ul className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {latest.map((post, index) => (
            <li key={post.slug}>
              <Link
                href={`/components/posts/${post.slug}`}
                className="group flex items-baseline gap-4 py-5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
              >
                <span className="w-8 shrink-0 font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-lg font-medium text-zinc-900 transition-colors group-hover:text-accent dark:text-zinc-100">
                    {post.title}
                  </span>
                  {post.summary ? (
                    <span className="mt-1 block truncate text-sm text-zinc-500 dark:text-zinc-400">
                      {post.summary}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                  {formatDate(post.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Link
            href="/components/posts"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-900 transition-colors hover:text-accent dark:text-zinc-100 dark:hover:text-accent"
          >
            Browse all posts
            <span
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
            updated {posts[0] ? formatDate(posts[0].date) : "—"}
          </p>
        </div>
      </div>
    </section>
  );
}
