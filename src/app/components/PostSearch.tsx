// src/app/components/PostSearch.tsx
// 文章搜索框：纯客户端过滤（标题 / 摘要 / 标签），不发请求、不索引正文，
// 所以换字即出结果，也不需要任何搜索服务。文章全部数据由服务端一次传入。

"use client";

import { useMemo, useState } from "react";
import PostList from "@/app/components/PostList";
import type { Post } from "@/app/content/posts";

export default function PostSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");

  // 把标题、摘要、标签拼成一条搜索文本，全部转小写后做子串匹配
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return posts;

    return posts.filter((post) =>
      [post.title, post.summary, post.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [posts, query]);

  const searching = query.trim().length > 0;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search 搜索标题、摘要、标签"
          aria-label="Search posts"
          className="w-full border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500"
        />
        {searching ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="shrink-0 border border-zinc-300 px-3 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
          >
            Clear
          </button>
        ) : null}
      </div>

      {searching ? (
        <p className="mt-3 text-xs text-zinc-400">
          {filtered.length} 篇匹配 “{query.trim()}”
        </p>
      ) : null}

      <PostList posts={filtered} />
    </div>
  );
}
