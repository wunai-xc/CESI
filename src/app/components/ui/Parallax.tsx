// src/app/components/ui/Parallax.tsx
// 通用视差容器：给子内容套一层随滚动上下位移的层（元素进入/离开视口的过程中生效）。
// 与首页星空的区别是这里用「元素自身相对视口的进度」，所以放在页面下半部分也能工作。
// 纯装饰用途，容器带 aria-hidden；系统开启「减少动态效果」时不位移。

"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export default function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  // 位移幅度（px）：元素从进入视口到离开视口，总共上下各走 distance
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={{ y: reducedMotion ? 0 : y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
