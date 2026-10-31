// src/app/components/TransitionOverlay.tsx
// 切页转场 + 页面扫描：
//  1) 先盖一层站点底色（把页面挡住），四角取景框、十字准线、计数与进度条依次出现；
//  2) 竖向色块从左往右扫、横向色块从下往上扫（交叉点从屏幕左下走到右上），
//     色块短边 10px → 50px → 10px，扫过时页面底色逐渐透明，内容就像被"扫"出来；
//  3) 同时给 <main> 加一个 page-enter 类，让内容在扫描后段淡入上移，与转场同步；
//  4) 整层淡出，背景虚化从 8px 收到 0。
// 总时长 1.1s，与页面是否加载完成无关；系统开启「减少动态效果」时整个转场不出现。

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

// 一遍转场的总时长（秒）
const DURATION = 1.1;
const EASE = [0.22, 1, 0.36, 1] as const;

// 数字计数：0 → 100，rAF 驱动（在回调里 setState，避免 effect 内同步 setState）
function Counter() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const span = 850;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / span);
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

// 四角取景框：每条是 L 形双描边，逐角淡入
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

  // 让页面内容跟着转场出现：路由变化时给 <main> 挂 page-enter，动画结束再摘掉。
  // 没有 JS 或开启减少动态效果时不加类，内容始终正常可见（渐进增强）。
  useEffect(() => {
    if (reducedMotion) return;

    const main = document.querySelector("main");
    if (!main) return;

    main.classList.remove("page-enter");
    // 读一次布局触发重排，保证连续切页时动画能重新开始
    void main.offsetWidth;
    main.classList.add("page-enter");

    const timer = window.setTimeout(() => {
      main.classList.remove("page-enter");
    }, DURATION * 1000);

    return () => {
      window.clearTimeout(timer);
      main.classList.remove("page-enter");
    };
  }, [pathname, reducedMotion]);

  // 减少动态效果：不渲染转场层
  if (reducedMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      <motion.div
        key={pathname}
        className="absolute inset-0"
        // 整层：背景虚化从 8px 收到 0；最后 20% 时间整体淡出，把页面交出去
        initial={{ opacity: 1, backdropFilter: "blur(8px)" }}
        animate={{ opacity: [1, 1, 0], backdropFilter: "blur(0px)" }}
        transition={{ duration: DURATION, times: [0, 0.8, 1], ease: "easeInOut" }}
      >
        {/* 1) 底色幕布：先在 0.25s 内挡住页面，再在扫描过程中淡出 */}
        <motion.div
          className="absolute inset-0 bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.45, delay: 0.25, ease: "easeInOut" }}
        />

        {/* 2) 扫描色块：纯实心色带，不加网格裁切。
            竖块短边（宽度）3 → 16 → 3px，细线条更像扫描线；整块从左外侧扫到右外侧 */}
        <motion.span
          className="absolute left-0 top-0 h-full bg-yellow-500"
          initial={{ width: 3, x: "-100%" }}
          animate={{ width: [3, 16, 3], x: ["-100%", 0, "100vw"] }}
          transition={{ duration: 0.85, delay: 0.12, ease: "easeInOut" }}
        />
        {/* 横块短边（高度）同理，从下外侧扫到上外侧 */}
        <motion.span
          className="absolute bottom-0 left-0 w-full bg-yellow-500"
          initial={{ height: 3, y: "100%" }}
          animate={{ height: [3, 16, 3], y: ["100%", 0, "-100vh"] }}
          transition={{ duration: 0.85, delay: 0.12, ease: "easeInOut" }}
        />

        {/* 扫描头：贴着竖块右缘的 1px 竖线，强化"正在扫"的感觉 */}
        <motion.span
          className="absolute top-0 h-full w-px bg-yellow-600/70 dark:bg-yellow-400/70"
          initial={{ x: "0vw" }}
          animate={{ x: "100vw" }}
          transition={{ duration: 0.85, delay: 0.12, ease: "easeInOut" }}
        />
        {/* 扫描头：贴着横块上缘的 1px 横线 */}
        <motion.span
          className="absolute left-0 w-full h-px bg-yellow-600/70 dark:bg-yellow-400/70"
          initial={{ y: "100vh" }}
          animate={{ y: "0vh" }}
          transition={{ duration: 0.85, delay: 0.12, ease: "easeInOut" }}
        />

        {/* 4) 取景框四角 */}
        <Bracket className="left-4 top-4 border-l-2 border-t-2" delay={0} />
        <Bracket className="right-4 top-4 border-r-2 border-t-2" delay={0.05} />
        <Bracket className="bottom-4 left-4 border-b-2 border-l-2" delay={0.1} />
        <Bracket className="bottom-4 right-4 border-b-2 border-r-2" delay={0.15} />

        {/* 5) 十字准线 */}
        <motion.span
          className="absolute left-1/2 top-1/2 h-px w-[min(72vw,420px)] -translate-x-1/2 -translate-y-1/2 bg-zinc-900/40 dark:bg-zinc-100/40"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
        />
        <motion.span
          className="absolute left-1/2 top-1/2 h-[min(40vh,220px)] w-px -translate-x-1/2 -translate-y-1/2 bg-zinc-900/40 dark:bg-zinc-100/40"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
        />

        {/* 6) 中心 HUD：计数 + 细进度条，最后和整层一起淡出 */}
        <motion.div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 px-3 py-2"
          initial={{ opacity: 1, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1, ease: EASE }}
        >
          <span className="bg-white/70 px-2 py-1 backdrop-blur-sm dark:bg-zinc-950/70">
            <Counter />
          </span>
          <span className="block h-px w-24 overflow-hidden bg-zinc-400/50 dark:bg-zinc-600/50">
            <motion.span
              className="block h-px w-full origin-left bg-zinc-900 dark:bg-zinc-100"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
