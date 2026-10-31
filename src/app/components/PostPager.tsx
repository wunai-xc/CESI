// src/app/components/PostPager.tsx
// 文章底部的「上一篇 / 下一篇」翻页按钮。
// 哪一侧没有相邻文章，就用「All posts 全部文章」按钮占位；两边都没有（只有一篇文章）时只显示一个。

import Link from "next/link";
import type { Post } from "@/app/content/posts";

// 统一的外框样式：方角、细边框、悬停变蓝
const boxClass =
  "flex flex-1 flex-col justify-center border border-zinc-200 px-4 py-3 transition-colors hover:border-accent dark:border-zinc-800 dark:hover:border-accent";

function PostLink({
  post,
  direction,
}: {
  post: Post;
  direction: "previous" | "next";
}) {
  const isPrevious = direction === "previous";

  return (
    <Link
      href={`/components/posts/${post.slug}`}
      className={[boxClass, isPrevious ? "sm:text-left" : "sm:text-right"].join(
        " ",
      )}
    >
      <span className="text-xs text-zinc-400 dark:text-zinc-500">
        {isPrevious ? "Previous 上一篇" : "Next 下一篇"}
      </span>
      <span className="mt-1 truncate text-sm text-zinc-700 dark:text-zinc-200">
        {post.title}
      </span>
    </Link>
  );
}

function AllPostsLink() {
  return (
    <Link
      href="/components/posts"
      className={[boxClass, "items-center text-sm text-zinc-600 dark:text-zinc-300"].join(
        " ",
      )}
    >
      All posts 全部文章
    </Link>
  );
}

export default function PostPager({
  previous,
  next,
}: {
  previous?: Post;
  next?: Post;
}) {
  // 只有一篇文章时，避免出现两个一模一样的「全部文章」按钮
  if (!previous && !next) {
    return (
      <nav
        aria-label="Post navigation"
        className="mt-12 border-t border-zinc-200 pt-6 dark:border-zinc-800"
      >
        <div className="flex">
          <AllPostsLink />
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Post navigation"
      className="mt-12 border-t border-zinc-200 pt-6 dark:border-zinc-800"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        {previous ? <PostLink post={previous} direction="previous" /> : <AllPostsLink />}
        {next ? <PostLink post={next} direction="next" /> : <AllPostsLink />}
      </div>
    </nav>
  );
}
