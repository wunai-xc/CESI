// src/app/components/PostList.tsx
// 文章列表：列表页、搜索结果、标签页共用的同一份渲染逻辑。
// 只依赖 type-only 的 Post 类型，因此服务端组件与客户端组件都能用。

import Link from "next/link";
import { formatDate } from "@/app/lib/formatDate";
import TagLink from "@/app/components/TagLink";
import type { Post } from "@/app/content/posts";

export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="mt-10 text-sm text-zinc-500">没有匹配的文章。</p>;
  }

  return (
    <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
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
        </li>
      ))}
    </ul>
  );
}
