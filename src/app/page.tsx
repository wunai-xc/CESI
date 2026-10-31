// src/app/page.tsx
// 首页（路由 /）：站点 logo（亮色 / 暗色两张）+ 欢迎语 + 去文章列表的入口。

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      {/* logo 在 h1 上方：亮色显示 light 图，暗色显示 dark 图（dark:hidden / dark:block 切换）。
          注意两张 png 是 500×500 的画布，真正的图案只有 400×100（上下各留白约 200px），
          所以这里显示高度要给到 h-64/h-72，视觉上的 logo 才和下面 text-5xl 的 h1 差不多大 */}
      <Image
        src="/icon/WUNAI-LOGO-light.png"
        alt="WUNAI Logo"
        width={500}
        height={500}
        priority
        className="h-64 w-auto block sm:h-72 dark:hidden"
      />
      <Image
        src="/icon/WUNAI-LOGO-dark.png"
        alt="WUNAI Logo"
        width={500}
        height={500}
        priority
        className="h-64 w-auto hidden sm:h-72 dark:block"
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
