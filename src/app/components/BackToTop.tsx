// src/app/components/BackToTop.tsx
// 文章页右下角的「返回顶部」悬浮按钮：
// 方形边框就是阅读进度条（SVG rect + stroke-dashoffset），中间显示进度百分比，点击平滑回到顶部。
// 按钮整体半透明，不遮挡正文阅读。

"use client";

import { useEffect, useState } from "react";


export default function BackToTop() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;

      // 优先按正文 <article data-reading-target> 计算：进度 0 在正文顶部，1 在正文底部进入视口
      const target = document.querySelector<HTMLElement>("[data-reading-target]");
      let next = 0;

      if (target) {
        const rect = target.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        next = scrollable > 0 ? -rect.top / scrollable : 0;
      } else {
        // 正文还没流式渲染出来时，退化成整页滚动进度
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        next = scrollable > 0 ? window.scrollY / scrollable : 0;
      }

      const clamped = Math.min(1, Math.max(0, next));
      // 变化小于 0.5% 就不触发重渲染，滚动时避免无意义的 setState
      setProgress((prev) => (Math.abs(prev - clamped) < 0.005 ? prev : clamped));
    };

    // 用 requestAnimationFrame 节流，滚动事件里只登记一帧
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const percent = Math.round(progress * 100);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      title="Back to top 返回顶部"
      className="fixed bottom-5 right-4 z-40 flex h-12 w-12 items-center justify-center bg-white/55 text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white/80 hover:text-blue-600 dark:bg-zinc-900/55 dark:text-zinc-200 dark:hover:bg-zinc-900/80 dark:hover:text-blue-400"
    >
      <svg viewBox="0 0 56 56" aria-hidden="true" className="absolute inset-0 h-full w-full">
        {/* 底线：淡色描边，表示 100% */}
        <rect
          x="1"
          y="1"
          width="54"
          height="54"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="2"
          pathLength={100}
        />
        {/* 进度线：pathLength=100 后 dasharray 就能直接按百分比算，从左上角顺时针增长 */}
        <rect
          x="1"
          y="1"
          width="54"
          height="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100 - percent}
        />
      </svg>
      <span className="relative text-[11px] font-medium tabular-nums">
        {percent}%
      </span>
    </button>
  );
}
