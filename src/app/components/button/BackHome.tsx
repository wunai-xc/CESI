// src/app/components/button/BackHome.tsx
// 返回按钮：默认「← Back Home」回首页；可以传 href / label 复用到其它页面
// （例如文章页回列表用 <BackHome href="/components/posts" label="← Back All Posts" />）。

import Link from "next/link";

export default function BackHome({
  href = "/",
  label = "← Back Home",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
    >
      {label}
    </Link>
  );
}
