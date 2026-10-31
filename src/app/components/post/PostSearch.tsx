// src/app/components/post/PostSearch.tsx
// 文章搜索框：纯客户端过滤（标题 / 摘要 / 标签），不发请求、不索引正文，换字即出结果。
// 用 useDeferredValue 把"输入"和"过滤"解耦：输入永远跟手，列表在后台重算，
// 关键词在结果里用 <mark> 高亮。

"use client";

import { useDeferredValue, useMemo, useState } from "react";
import PostList from "@/app/components/post/PostList";
import { parseTerms } from "@/app/components/post/Highlight";
import type { Post } from "@/app/content/posts";

export default function PostSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  // 输入框用 query（即时更新），过滤和高亮用 deferredQuery（稍后跟进）
  const deferredQuery = useDeferredValue(query);

  const terms = useMemo(() => parseTerms(deferredQuery), [deferredQuery]);

  // 多个关键词取交集：全部命中才算匹配
  const filtered = useMemo(() => {
    if (terms.length === 0) return posts;

    return posts.filter((post) => {
      const haystack = [post.title, post.summary, post.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [posts, terms]);

  // 输入已变但结果还没跟上时，列表轻微变淡，提示"正在筛"
  const stale = query !== deferredQuery;
  const searching = terms.length > 0;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search 搜索标题、摘要、标签"
          aria-label="Search posts"
          className="w-full border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-accent focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-accent"
        />
        {query ? (
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
          {filtered.length} 篇匹配 “{deferredQuery.trim()}”
        </p>
      ) : null}

      <div className={stale ? "opacity-60 transition-opacity" : "transition-opacity"}>
        <PostList
          posts={filtered}
          terms={terms}
          emptyText={`没有匹配 “${deferredQuery.trim()}” 的文章。`}
        />
      </div>
    </div>
  );
}
