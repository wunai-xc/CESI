// src/app/components/TransitionOverlay.tsx
// 切页转场层：每次路由变化在屏幕中央播一遍「取景框 + 十字准线 + 计数 + 进度条」，
// 同时把背后的页面从虚化拉回清晰。总时长固定 1s，与页面是否加载完成无关。
// 用 motion 的声明式动画驱动（key={pathname} 触发重新挂载即重播），
// 系统开启「减少动态效果」时整个转场不出现。

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// 一遍转场的总时长
const DURATION = 1;
const EASE = [0.22, 1, 0.36, 1] as const;

// 数字计数：0 → 100，用 rAF 更新（在回调里 setState，避免 effect 内同步 setState）
function Counter() {
  const [value, setValue] = useState(0);
  const restMs = 900;

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / restMs);
      setValue(Math.round(progress * 100));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <span className="text-[11px] font-medium tabular-nums tracking-widest text-zinc-700 dark:text-zinc-200">
      {String(value).padStart(3, "0")}
    </span>
  );
}

// 四角的取景框：每边一条 L 形描边，逐角淡入
function Bracket({ className, delay }: { className: string; delay: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`absolute h-6 w-6 border-zinc-900/70 dark:border-zinc-100/70 ${className}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay, ease: EASE }}
    />
  );
}

export default function TransitionOverlay() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  // 减少动态效果：不做转场，直接不渲染（连层都不挂）
  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="absolute inset-0"
          // 整体：后段淡出，把页面交出来
          initial={{ opacity: 1, backdropFilter: "blur(8px)" }}
          animate={{ opacity: [1, 1, 0], backdropFilter: ["blur(8px)", "blur(4px)", "blur(0px)"] }}
          transition={{ duration: DURATION, times: [0, 0.82, 1], ease: "easeInOut" }}
        >
          {/* 取景框：四个角 */}
          <Bracket className="left-4 top-4 border-l-2 border-t-2" delay={0} />
          <Bracket className="right-4 top-4 border-r-2 border-t-2" delay={0.05} />
          <Bracket className="bottom-4 left-4 border-b-2 border-l-2" delay={0.1} />
          <Bracket className="bottom-4 right-4 border-b-2 border-r-2" delay={0.15} />

          {/* 十字准线：从中间向两侧展开 */}
          <motion.span
            className="absolute left-1/2 top-1/2 h-px w-[min(72vw,420px)] -translate-x-1/2 -translate-y-1/2 bg-zinc-900/50 dark:bg-zinc-100/50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
          />
          <motion.span
            className="absolute left-1/2 top-1/2 h-[min(40vh,220px)] w-px -translate-x-1/2 -translate-y-1/2 bg-zinc-900/50 dark:bg-zinc-100/50"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
          />

          {/* 准线交点处的中心块：放计数与进度条 */}
          <motion.div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 bg-white/70 px-3 py-2 backdrop-blur-sm dark:bg-zinc-950/70"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1, ease: EASE }}
          >
            <Counter />
            {/* 进度条：1px 细线，左端向左展开 */}
            <span className="block h-px w-24 overflow-hidden bg-zinc-300/70 dark:bg-zinc-700/70">
              <motion.span
                className="block h-px w-full origin-left bg-zinc-900 dark:bg-zinc-100"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.85, delay: 0.1, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
