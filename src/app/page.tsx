// src/app/page.tsx
// 首页（路由 /）：站点 logo（亮色 / 暗色两张）+ 欢迎语 + 去文章列表的入口。
// 三块内容用 Reveal 做错峰入场（CSS 动画，不依赖 JS）。

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      {/* logo 在 h1 上方：亮色显示 light 图，暗色显示 dark 图（dark:hidden / dark:block 切换）。
          两张 png 已裁掉多余透明边，实际尺寸 400×100，所以 h-12/h-14 就是图案本身的高度 */}
      <Reveal className="flex justify-center">
        <Image
          src="/icon/WUNAI-LOGO-light.png"
          alt="WUNAI Logo"
          width={400}
          height={100}
          priority
          className="h-12 w-auto block sm:h-14 dark:hidden"
        />
        <Image
          src="/icon/WUNAI-LOGO-dark.png"
          alt="WUNAI Logo"
          width={400}
          height={100}
          priority
          className="h-12 w-auto hidden sm:h-14 dark:block"
        />
      </Reveal>

      <Reveal delay={0.08}>
        <h1 className="text-center text-5xl">Hello! This is my App.</h1>
      </Reveal>

      <Reveal delay={0.16}>
        <Link
          href="/components/posts"
          className="inline-block px-5 py-2 text-sm transition-colors hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400"
        >
          All Posts →
        </Link>
      </Reveal>
    </div>
  );
}
