// src/app/components/posts/tag/[tag]/page.tsx
// 标签页，路由 /components/posts/tag/<tag>：列出该标签下的所有文章。
// 结构和文章详情页一致：页面外壳同步渲染，读 URL 参数的部分放进 Suspense，
// 这样 cacheComponents 预渲染时不会因为提前读 params 而报错。

import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/app/content/posts";
import PostList from "@/app/components/PostList";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

// 每个出现过的标签都在构建时预渲染成静态页面
export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `标签 #${tag} 下的所有文章`,
  };
}

export default function TagPage({ params }: TagPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/components/posts"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← Back All Posts
      </Link>

      <Suspense
        fallback={<p className="mt-8 text-sm text-zinc-500">Loading 加载中…</p>}
      >
        <TagBody params={params} />
      </Suspense>
    </div>
  );
}

async function TagBody({ params }: TagPageProps) {
  const { tag } = await params;
  const tagged = getPostsByTag(tag);
  if (tagged.length === 0) notFound();

  // 未编码的 tag 可能带空格等字符，这里统一用 URL 编码后的形式再匹配一次兜底
  const totalWords = tagged.reduce((sum, post) => sum + post.wordCount, 0);

  return (
    <>
      <header className="mt-6 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          #{tag}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          共 {tagged.length} 篇 · 总计 {totalWords.toLocaleString()} 字
        </p>
      </header>

      <PostList posts={tagged} />
    </>
  );
}
