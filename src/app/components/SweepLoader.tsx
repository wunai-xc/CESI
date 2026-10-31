// src/app/components/SweepLoader.tsx
// 切页扫屏动画：竖块从左往右、横块从下往上扫过整屏，交叉点从左下角移到右上角；
// 同时用 backdrop-filter 把背后的页面先虚化再逐渐变清晰。
// 用 Web Animations API 驱动，每次路由变化只播一遍（iterations: 1），与页面是否加载完成无关。

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// 一遍动画的时长（毫秒）
const BASE_DURATION = 300;

export default function SweepLoader() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLSpanElement>(null);
  const horizontalRef = useRef<HTMLSpanElement>(null);
  const lastRunRef = useRef(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    const vertical = verticalRef.current;
    const horizontal = horizontalRef.current;
    if (!overlay || !vertical || !horizontal) return;

    // 系统开了"减少动态效果"时放慢、改线性，避免突兀
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? BASE_DURATION * 2 : BASE_DURATION;
    const easing = reduced ? "linear" : "ease-in-out";

    // 防重复触发：一次动画没播完就忽略新的 pathname 变化（软导航可能更新两次）
    const now = Date.now();
    if (now - lastRunRef.current < duration) return;
    lastRunRef.current = now;

    const sweep = {
      duration,
      easing,
      iterations: 1,
      fill: "forwards",
    } satisfies KeyframeAnimationOptions;

    // 虚化：16px → 0，播完不加 fill，滤镜自动撤销，不长期占着合成层
    const blur = overlay.animate(
      [
        { backdropFilter: "blur(16px)" },
        { backdropFilter: "blur(0px)" },
      ],
      { duration, easing: "ease-out", iterations: 1 },
    );

    // 竖块：短边（宽度）10px → 50px → 10px，整块从屏幕左侧外移到右侧外
    const verticalAnimation = vertical.animate(
      [
        { opacity: 1, width: "10px", transform: "translateX(-100%)" },
        { opacity: 1, width: "50px", offset: 0.5 },
        { opacity: 1, width: "10px", transform: "translateX(100vw)" },
      ],
      sweep,
    );

    // 横块：短边（高度）10px → 50px → 10px，整块从屏幕下方外移到上方外
    const horizontalAnimation = horizontal.animate(
      [
        { opacity: 1, height: "10px", transform: "translateY(100%)" },
        { opacity: 1, height: "50px", offset: 0.5 },
        { opacity: 1, height: "10px", transform: "translateY(-100svh)" },
      ],
      sweep,
    );

    // 卸载/重新触发前取消，避免动画叠加
    return () => {
      blur.cancel();
      verticalAnimation.cancel();
      horizontalAnimation.cancel();
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {/* 默认 opacity-0，只有在动画关键帧里才显示，没触发时完全不露面 */}
      <span
        ref={verticalRef}
        className="absolute left-0 top-0 h-full w-[10px] bg-black opacity-0 dark:bg-white"
      />
      <span
        ref={horizontalRef}
        className="absolute bottom-0 left-0 h-[10px] w-full bg-black opacity-0 dark:bg-white"
      />
    </div>
  );
}
