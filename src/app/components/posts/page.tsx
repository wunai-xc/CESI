// src/app/components/posts/page.tsx
// 全部文章列表页，路由 /components/posts。
// 数据来自 src/app/content/posts.ts（读取 content/posts/*.mdx 的 frontmatter）。

import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/app/content/posts";
import { formatDate } from "@/app/lib/formatDate";

export const metadata: Metadata = {
  title: "全部文章",
  description: "WUNAI 的全部文章列表",
};

export default function PostsPage() {
  // 全站文章总字数：构建期汇总，每篇的 wordCount 在 posts.ts 里已经算好
  const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <header className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          All Posts
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          共 {posts.length} 篇 · 总计 {totalWords.toLocaleString()} 字
        </p>
      </header>

      {/* 没有文章时的空状态 */}
      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-zinc-500">还没有文章。</p>
      ) : (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {posts.map((post) => (
            <li key={post.slug} className="py-6">
              <Link href={`/components/posts/${post.slug}`} className="group block">
                <h2 className="text-xl font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                  {post.title}
                </h2>
                {post.summary ? (
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {post.summary}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-400">
                  {/* dateTime 给搜索引擎和读屏用，显示用本地化格式 */}
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>{post.wordCount.toLocaleString()} 字</span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-zinc-100 px-2.5 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
