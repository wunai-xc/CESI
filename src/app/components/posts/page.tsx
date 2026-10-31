// src/app/components/posts/page.tsx
// 全部文章列表页，路由 /components/posts。
// 数据来自 src/app/content/posts.ts（读取 content/posts/*.mdx 的 frontmatter）。
// 顶部是标签总览（点进标签页），下面是搜索框 + 文章列表（客户端过滤）。

import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/app/content/posts";
import PostSearch from "@/app/components/post/PostSearch";

export const metadata: Metadata = {
  title: "全部文章",
  description: "WUNAI 的全部文章列表",
  alternates: { canonical: "/components/posts" },
};

export default function PostsPage() {
  const posts = getAllPosts();

  // 全站文章总字数：构建期汇总，每篇的 wordCount 在 posts.ts 里已经算好
  const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0);
  const tags = getAllTags();

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <header className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          全部文章
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          共 {posts.length} 篇 · 总计 {totalWords.toLocaleString()} 字
        </p>

        {/* 标签总览：数量倒序，点进对应标签页 */}
        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/components/posts/tag/${encodeURIComponent(tag)}`}
                className="bg-zinc-100 px-2.5 py-0.5 text-zinc-600 transition-colors hover:text-accent dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-accent"
              >
                #{tag}
                <span className="ml-1 text-zinc-400 dark:text-zinc-500">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <PostSearch posts={posts} />
    </div>
  );
}
