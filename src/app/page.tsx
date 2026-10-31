// src/app/page.tsx
// 首页（路由 /）：站点 logo（亮色 / 暗色两张）+ 欢迎语 + 去文章列表的入口。

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      {/* logo 在 h1 上方：亮色显示 light 图，暗色显示 dark 图（dark:hidden / dark:block 切换） */}
      <Image
        src="/icon/WUNAI-LOGO-light.png"
        alt="WUNAI Logo"
        width={500}
        height={500}
        priority
        className="h-32 w-auto block sm:h-40 dark:hidden"
      />
      <Image
        src="/icon/WUNAI-LOGO-dark.png"
        alt="WUNAI Logo"
        width={500}
        height={500}
        priority
        className="h-32 w-auto hidden sm:h-40 dark:block"
      />

      <h1 className="text-center text-5xl">Hello! This is my App.</h1>

      <Link
        href="/components/posts"
        className="px-5 py-2 text-sm transition-colors hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400"
      >
        All Posts →
      </Link>
    </div>
  );
}
