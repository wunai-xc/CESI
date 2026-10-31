// src/app/components/post/PostList.tsx
// 文章列表：列表页、搜索结果、标签页共用的同一份渲染逻辑。
// 入场动画用 CSS（Reveal 的 animate-rise）+ 逐项延迟，不依赖 JS；
// 只依赖 type-only 的 Post 类型，所以服务端组件里能直接用。
// 传入 terms 时会把标题、摘要里的命中词高亮。

import Link from "next/link";
import { formatDate } from "@/app/lib/formatDate";
import Highlight from "@/app/components/post/Highlight";
import Reveal from "@/app/components/ui/Reveal";
import TagLink from "@/app/components/post/TagLink";
import type { Post } from "@/app/content/posts";

export default function PostList({
  posts,
  terms = [],
  emptyText = "没有匹配的文章。",
}: {
  posts: Post[];
  terms?: string[];
  emptyText?: string;
}) {
  if (posts.length === 0) {
    return <p className="mt-10 text-sm text-zinc-500">{emptyText}</p>;
  }

  return (
    <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
      {posts.map((post, index) => (
        // 逐项延迟最多 0.4s，长列表末尾不会等太久
        <Reveal as="li" key={post.slug} className="py-6" delay={Math.min(index * 0.04, 0.4)}>
          <Link href={`/components/posts/${post.slug}`} className="group block">
            <h2 className="text-xl font-semibold text-zinc-900 transition-colors group-hover:text-accent dark:text-zinc-100">
              <Highlight text={post.title} terms={terms} />
            </h2>
            {post.summary ? (
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                <Highlight text={post.summary} terms={terms} />
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-400">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{post.wordCount.toLocaleString()} 字</span>
            </div>
          </Link>

          {/* 标签放在外层：点标签进标签页，点其它区域进文章详情 */}
          {post.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              {post.tags.map((tag) => (
                <TagLink key={tag} tag={tag} />
              ))}
            </div>
          ) : null}
        </Reveal>
      ))}
    </ul>
  );
}
