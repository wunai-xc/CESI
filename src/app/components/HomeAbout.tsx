// src/app/components/HomeAbout.tsx
// 首页第三段：关于 + 联系方式。同样的滚动入场，左标题右内容的两栏结构，
// 窄屏自动堆叠。链接沿用站点风格（英文为主，必要时中英并列）。

import Link from "next/link";

// 联系方式：与页脚保持一致，方便集中修改
const LINKS = [
  { label: "GitHub", href: "https://github.com/wunai-xc", external: true },
  { label: "BiliBili", href: "https://b23.tv/GX3txwm", external: true },
  { label: "Email", href: "mailto:3234319738@qq.com", external: false },
];

export default function HomeAbout() {
  return (
    <section className="relative border-t border-zinc-200 bg-zinc-50 px-6 py-20 dark:border-zinc-800 dark:bg-black">
      <div className="scroll-reveal mx-auto grid w-full max-w-3xl gap-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
            02 / about
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            About 关于
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            这里是一个用来放代码笔记和技术记录的地方。文章都写在
            <code className="mx-1 border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
              .mdx
            </code>
            文件里，构建期编译成静态页面，没有后端、没有数据库。
          </p>

          {/* 联系方式：等宽小字 + 下划线动效 */}
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
                >
                  <span className="h-px w-4 bg-zinc-400 transition-all duration-200 group-hover:w-6 group-hover:bg-blue-500" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/content/about"
              className="inline-flex items-center gap-2 border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
            >
              Read more
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              built with next.js · mdx · tailwind
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
