// src/app/components/layout/Navbar.tsx
// 顶部导航条：左侧站点 logo（亮色/暗色两张图切换），右侧是页面入口。

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="bg-white dark:text-zinc-100 shadow-md border-b dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* logo：点回首页；两张图靠 dark:hidden / dark:block 做配色切换 */}
        <Link href="/" className="text-3xl font-bold dark:text-white transition-colors hover:text-accent flex items-center">
          <Image
            src="/icon/WUNAI.png"
            alt="WUNAI Logo"
            width={120}
            height={40}
            className="w-auto h-8 block dark:hidden"
          />
          <Image
            src="/icon/WUNAI-dark.png"
            alt="WUNAI Logo"
            width={120}
            height={40}
            className="w-auto h-8 hidden dark:block"
          />
        </Link>

        {/* 页面入口：文章列表压在 /components/posts 路由下 */}
        <div className="flex items-center space-x-6">
          <Link href="/components/posts" className="transition-colors hover:text-accent">
            All posts
          </Link>
          <Link href="/content/about" className="transition-colors hover:text-accent">
            About
          </Link>
          <Link href="/content/links" className="transition-colors hover:text-accent">
            Links
          </Link>
        </div>
      </nav>
    </header>
  );
}
