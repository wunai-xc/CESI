// src/app/components/home/ContourBackdrop.tsx
// 首页地形等高线背景：没有图片，全部由代码生成（见 src/app/lib/contour.ts）。
// 每次刷新用随机种子重新生成一片地形，所以每回看到的等高线都不一样。
// 因为要随机，只能在客户端挂载后生成（服务端渲染会是固定结果，静态导出也无法按请求变化）；
// 生成放在第一帧之后，避免 useEffect 里同步 setState，也顺便让首屏 JS 先跑完。
// 线条用 currentColor + 低透明度，亮暗模式自动跟着变；滚动视差与缓动漂移都交给 CSS。

"use client";

import { useEffect, useState } from "react";
import { generateContours, type ContourLine } from "@/app/lib/contour";

// 每次刷新换一个种子（用当前时间 + 随机数，够随机也不用引入额外依赖）
function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31) ^ Date.now() % 100000;
}

export default function ContourBackdrop() {
  const [lines, setLines] = useState<ContourLine[] | null>(null);

  useEffect(() => {
    // 放到下一帧执行：既避开「effect 内同步 setState」的规则，也不挡首屏渲染
    const frame = requestAnimationFrame(() => {
      setLines(
        generateContours({
          seed: randomSeed(),
          // 客户端生成，网格比构建期略小一点，手机上几十毫秒就能算完
          gridX: 104,
          gridY: 70,
        }),
      );
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="contour-drift pointer-events-none absolute inset-0 overflow-hidden text-zinc-900/25 dark:text-zinc-100/20"
      aria-hidden="true"
    >
      {lines ? (
        <div className="contour-flow contour-fade absolute inset-0">
          <svg
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            {lines.map((line) =>
              line.paths.map((d, index) => (
                <path
                  key={`${line.value}-${index}`}
                  d={d}
                  strokeWidth={line.major ? 1.15 : 0.65}
                  opacity={line.major ? 0.9 : 0.5}
                />
              )),
            )}
          </svg>
        </div>
      ) : null}
    </div>
  );
}
