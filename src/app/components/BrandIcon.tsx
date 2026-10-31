// src/app/components/BrandIcon.tsx
// 品牌图标组件：从 brand-icons.ts 里取出 simple-icons 的路径数据，用内联 SVG 渲染。
// 全部离线，不请求任何图标 CDN（国内可正常显示）。

import { brandIcons, type BrandName } from "./brand-icons";

type BrandIconProps = {
  name: BrandName;
  className?: string;
};

export default function BrandIcon({
  name,
  className = "h-4 w-4",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={brandIcons[name]} />
    </svg>
  );
}
