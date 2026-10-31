// src/app/components/HomeHero.tsx
// 首页第一屏：眉标 + 渐变标题 + 打字机标语 + 按钮 + 下滑提示。
// 所有效果都是 CSS 动画（见 src/app/styles/animations.css），不依赖 JS：
// 静态导出后即使脚本没加载完，文字依然可见。

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

// 打字机内容：中文字宽约 1em，正好可以用「字数 × 1em」当结束宽度
const TYPED_LINE = "用代码写点东西，也写点没想清楚的想法。";

export default function HomeHero() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden bg-zinc-50 px-6 py-20 dark:bg-black">
      {/* 背景层：漂移网格 + 呼吸光晕 */}
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div className="hero-glow absolute inset-0" aria-hidden="true" />

      <div className="relative flex w-full max-w-3xl flex-col items-center gap-7 text-center">
        {/* logo */}
        <div
          className="animate-rise flex justify-center"
          style={{ animationDelay: "0s" }}
        >
          <Image
            src="/icon/WUNAI-LOGO-light.png"
            alt="WUNAI Logo"
            width={400}
            height={100}
            priority
            className="h-11 w-auto block dark:hidden"
          />
          <Image
            src="/icon/WUNAI-LOGO-dark.png"
            alt="WUNAI Logo"
            width={400}
            height={100}
            priority
            className="h-11 w-auto hidden dark:block"
          />
        </div>

        {/* 眉标 */}
        <div
          className="animate-rise flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-500 dark:text-zinc-400"
          style={{ animationDelay: "0.06s" }}
        >
          <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-700" />
          Personal blog
          <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* 多色渐变标题：bg-clip-text 把背景裁进文字，再叠一层柔光阴影 */}
        <h1
          className="animate-rise text-balance bg-gradient-to-r from-blue-600 via-fuchsia-500 to-amber-500 bg-clip-text text-5xl font-bold leading-[1.15] tracking-tight text-transparent drop-shadow-[0_6px_24px_rgba(99,102,241,0.25)] sm:text-6xl dark:from-blue-300 dark:via-fuchsia-300 dark:to-amber-200 dark:drop-shadow-[0_6px_28px_rgba(129,140,248,0.28)]"
          style={{ animationDelay: "0.12s" }}
        >
          Hello, I&apos;m WUNAI.
        </h1>

        {/* 打字机标语 + 光标 */}
        <p
          className="animate-rise flex max-w-full items-baseline justify-center gap-1 text-sm leading-7 text-zinc-600 dark:text-zinc-400"
          style={{ animationDelay: "0.4s" }}
        >
          <span
            className="animate-typing"
            style={{ "--type-chars": TYPED_LINE.length } as CSSProperties}
          >
            {TYPED_LINE}
          </span>
          <span
            className="animate-caret inline-block h-4 w-[2px] bg-zinc-800 align-middle dark:bg-zinc-200"
            aria-hidden="true"
          />
        </p>

        {/* 按钮 */}
        <div
          className="animate-rise flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.52s" }}
        >
          <Link
            href="/components/posts"
            className="group inline-flex items-center gap-2 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-blue-400"
          >
            All Posts
            <span
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
          <Link
            href="/content/about"
            className="inline-flex items-center gap-2 border border-zinc-300 px-5 py-2.5 text-sm text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
          >
            About 关于
          </Link>
        </div>
      </div>

      {/* 下滑提示 */}
      <div
        className="animate-rise absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500"
        style={{ animationDelay: "0.7s" }}
      >
        scroll
        <span className="animate-bounce text-base leading-none" aria-hidden="true">
          ↓
        </span>
      </div>
    </section>
  );
}
