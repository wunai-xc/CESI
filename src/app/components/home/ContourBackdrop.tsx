// src/app/components/home/ContourBackdrop.tsx
// 首页地形等高线背景：没有图片，全部由代码生成（见 src/app/lib/contour.ts）。
// 构建期算一次就固化成 SVG path，运行时零开销；
// 线条用 currentColor + 低透明度，亮暗模式自动跟着变。
// 滚动时轻微下移，由 CSS 的 scroll timeline 驱动（.contour-drift），不支持则静止。

import { generateContours } from "@/app/lib/contour";

// 模块级缓存：同一次构建里只算一次
const CONTOURS = generateContours();

export default function ContourBackdrop() {
  return (
    <div
      className="contour-drift pointer-events-none absolute inset-0 overflow-hidden text-zinc-900/25 dark:text-zinc-100/20"
      aria-hidden="true"
    >
      {/* 内层负责缓动漂移，外层 .contour-drift 负责滚动视差，两层 transform 互不影响 */}
      <div className="contour-flow absolute inset-0">
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {CONTOURS.map((line) =>
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
    </div>
  );
}
