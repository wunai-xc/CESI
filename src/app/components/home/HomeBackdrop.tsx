// src/app/components/home/HomeBackdrop.tsx
// 首页背景：两层星空视差（NASA 公开图像，已压成 1800px / 1400px 的 jpg）。
// 用 motion 的 useScroll + useTransform 让远近两层以不同速度位移，形成视差。
// 图片保持原始画质与颜色：不加透明度、不加灰阶，也不盖遮罩；
// 文字可读性交给 HomeHero 里的 .text-invert（mix-blend-mode: difference）解决。
// 纯装饰（aria-hidden），系统开启「减少动态效果」时不位移。

"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export default function HomeBackdrop() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // 远处那层动得慢、近处动得快；前 900px 内完成位移，滚出首屏后不再变化
  const farY = useTransform(scrollY, [0, 900], [0, 60]);
  const nearY = useTransform(scrollY, [0, 900], [0, 160]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 远景星场：放大到 110% 避免位移时露出边缘；亮色模式压成灰阶低透明，只当纹理 */}
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ y: reducedMotion ? 0 : farY }}
      >
        <Image
          src="/images/stars-far.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </motion.div>

      {/* 近景星云：位移更大，层叠出深度 */}
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ y: reducedMotion ? 0 : nearY }}
      >
        <Image
          src="/images/stars-1.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
