// src/app/components/TagLink.tsx
// 标签小胶囊：列表页、标签页、文章页共用。点击进入该标签的文章列表。
// 没有 "use client"，服务端组件和客户端组件里都能直接渲染。

import Link from "next/link";

export default function TagLink({
  tag,
  className = "",
}: {
  tag: string;
  className?: string;
}) {
  return (
    <Link
      href={`/components/posts/tag/${encodeURIComponent(tag)}`}
      // 标签是数据、不是按钮，保持方角，悬停变蓝提示可点
      className={[
        "inline-block bg-zinc-100 px-2.5 py-0.5 text-zinc-600 transition-colors hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-blue-400",
        className,
      ].join(" ")}
    >
      #{tag}
    </Link>
  );
}
