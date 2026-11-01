// src/app/components/home/HomeHero.tsx
// 首页第一屏：黑白灰配色（白底黑字 / 暗色炭黑），纯色背景，不加网格或光晕。
// 眉标 + 标题 + 打字机标语 + 数据条 + 按钮 + 下滑提示。
// 效果全部是 CSS 动画（见 src/app/styles/animations.css），不依赖 JS，
// 静态导出后即使脚本没加载完文字也可见。

import type { CSSProperties } from "react";
import Image from "next/image";
import HomeBackdrop from "@/app/components/home/HomeBackdrop";

// 打字机内容：中文字宽约 1em，正好可以用「字数 × 1em」当结束宽度
const TYPED_LINE = "用代码写点东西，也写点没想清楚的想法。";

export default function HomeHero({
  postCount,
  wordCount,
  latestDate,
}: {
  postCount: number;
  wordCount: number;
  latestDate: string;
}) {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden bg-background px-6 py-20">
      {/* 背景：两层星空视差 + 中央遮罩 */}
      <HomeBackdrop />

      <div className="relative flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        {/* logo */}
        <div
          className="animate-rise flex justify-center bg-white dark:bg-black"
          style={{ animationDelay: "0s" }}
        >
          <Image
            src="/icon/WUNAI.png"
            alt="WUNAI Logo"
            width={400}
            height={100}
            priority
            className="h-11 w-auto block dark:hidden"
          />
          <Image
            src="/icon/WUNAI-dark.png"
            alt="WUNAI Logo"
            width={400}
            height={100}
            priority
            className="h-11 w-auto hidden dark:block"
          />
        </div>

        {/* 眉标：等宽小字 + 两侧细线；text-invert 让颜色与下方星空反向 */}
        <div
          className="animate-rise text-invert flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em]"
          style={{ animationDelay: "0.06s" }}
        >
          <span className="h-px w-8 bg-current opacity-40" />
          Personal blog
          <span className="h-px w-8 bg-current opacity-40" />
        </div>

        {/* 标题：同样走 text-invert（白字 + difference），压在星空上自动取反色 */}
        <h1
          className="animate-rise text-invert text-balance text-5xl font-bold leading-[1.15] tracking-tight sm:text-6xl"
          style={{ animationDelay: "0.12s" }}
        >
          Hello, I&apos;m WUNAI.
        </h1>

        {/* 打字机标语 + 光标：同样走 text-invert，压在星空上自动取反色 */}
        <p
          className="animate-rise text-invert flex max-w-full items-baseline justify-center gap-1 font-mono text-xs leading-7 tracking-wide"
          style={{ animationDelay: "0.4s" }}
        >
          <span
            className="animate-typing"
            style={{ "--type-chars": TYPED_LINE.length } as CSSProperties}
          >
            {TYPED_LINE}
          </span>
          <span
            className="animate-caret inline-block h-3.5 w-[2px] bg-current align-middle"
            aria-hidden="true"
          />
        </p>

        {/* 数据条：等宽小字 + 竖线分隔，像设备铭牌 */}
        <dl
          className="animate-rise flex divide-x divide-line bg-panel font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="px-4 py-2">
            <dt className="text-zinc-600 dark:text-zinc-400">Posts</dt>
            <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
              {String(postCount).padStart(2, "0")}
            </dd>
          </div>
          <div className="px-4 py-2">
            <dt className="text-zinc-600 dark:text-zinc-400">Words</dt>
            <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
              {wordCount.toLocaleString()}
            </dd>
          </div>
          <div className="px-4 py-2">
            <dt className="text-zinc-600 dark:text-zinc-400">Updated</dt>
            <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
              {latestDate || "—"}
            </dd>
          </div>
        </dl>
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
