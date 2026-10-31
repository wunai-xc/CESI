// src/app/components/BackToTop.tsx
// 文章页右下角的「返回顶部」悬浮按钮：
// 圆环边框就是阅读进度条（SVG stroke-dashoffset），中间显示进度百分比，点击平滑回到顶部。

"use client";

import { useEffect, useState } from "react";

// 圆环半径与周长（viewBox 56x56，线宽 2，半径留 26 不裁到边缘）
const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
      // 圆环是几何形状，这里用行内 borderRadius 而不是 rounded-full（全站不用圆角工具类）
      style={{ borderRadius: "50%" }}
      className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center bg-white/90 text-zinc-600 shadow-sm backdrop-blur transition-colors hover:text-blue-600 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:text-blue-400"
    >
      <svg
        viewBox="0 0 56 56"
        aria-hidden="true"
        // -rotate-90 让圆环从正上方开始顺时针增长
        className="absolute inset-0 h-full w-full -rotate-90"
      >
        {/* 底环：淡色描边，表示 100% */}
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
        {/* 进度环：dashoffset 越接近 0 显示得越多 */}
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
        />
      </svg>
      <span className="relative text-[11px] font-medium tabular-nums">
        {percent}%
      </span>
    </button>
  );
}
