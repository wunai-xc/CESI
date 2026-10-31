// src/app/components/HomeHero.tsx
// 首页 hero：logo + 眉标 + 逐词入场的大标题 + 标语（带闪烁光标）+ 站点数据 + 两个入口按钮。
// 全部效果都用 CSS 动画（见 src/app/styles/animations.css），不依赖 JS，
// 静态导出后即使脚本没加载完，文字也是可见的。

import Image from "next/image";
import Link from "next/link";

type HomeHeroProps = {
  postCount: number;
  wordCount: number;
  // 最近一篇文章的日期（YYYY-MM-DD），没有文章时传空串
  latestDate: string;
};

// 大标题按词拆开，逐词错峰入场；最后一个是描边字
const HEADLINE = ["Hello,", "I'm", "WUNAI."];

export default function HomeHero({
  postCount,
  wordCount,
  latestDate,
}: HomeHeroProps) {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-zinc-50 px-6 py-20 dark:bg-black">
      {/* 背景层：漂移网格 + 呼吸光晕 */}
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div className="hero-glow absolute inset-0" aria-hidden="true" />

      <div className="relative flex w-full max-w-3xl flex-col items-center gap-7 text-center">
        {/* logo：亮/暗两张图切换 */}
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

        {/* 眉标：等宽小字 + 两侧细线 */}
        <div
          className="animate-rise flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-500 dark:text-zinc-400"
          style={{ animationDelay: "0.06s" }}
        >
          <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-700" />
          Personal blog
          <span className="h-px w-8 bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* 大标题：逐词入场，最后一个词用描边 */}
        <h1 className="text-balance text-5xl font-bold leading-[1.15] tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
          {HEADLINE.map((word, index) => (
            <span
              key={word}
              className="animate-rise inline-block"
              style={{ animationDelay: `${0.12 + index * 0.09}s` }}
            >
              {index === HEADLINE.length - 1 ? (
                <span className="text-outline">{word}</span>
              ) : (
                word
              )}
              {index < HEADLINE.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </h1>

        {/* 标语 + 闪烁光标 */}
        <p
          className="animate-rise max-w-lg text-sm leading-7 text-zinc-600 dark:text-zinc-400"
          style={{ animationDelay: "0.42s" }}
        >
          记录代码、笔记，和一些还没想清楚的想法。
          <span
            className="animate-caret ml-1 inline-block h-4 w-[2px] translate-y-[3px] bg-zinc-800 align-middle dark:bg-zinc-200"
            aria-hidden="true"
          />
        </p>

        {/* 站点数据：等宽小字 + 竖线分隔 */}
        <dl
          className="animate-rise flex divide-x divide-zinc-300 border border-zinc-300 font-mono text-[10px] uppercase tracking-[0.18em] dark:divide-zinc-700 dark:border-zinc-700"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="px-4 py-2">
            <dt className="text-zinc-400 dark:text-zinc-500">Posts</dt>
            <dd className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
              {String(postCount).padStart(2, "0")}
            </dd>
          </div>
          <div className="px-4 py-2">
            <dt className="text-zinc-400 dark:text-zinc-500">Words</dt>
            <dd className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
              {wordCount.toLocaleString()}
            </dd>
          </div>
          <div className="px-4 py-2">
            <dt className="text-zinc-400 dark:text-zinc-500">Updated</dt>
            <dd className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
              {latestDate || "—"}
            </dd>
          </div>
        </dl>

        {/* 入口按钮：主按钮反色 + 箭头位移，次按钮描边 */}
        <div
          className="animate-rise flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.58s" }}
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
    </section>
  );
}
