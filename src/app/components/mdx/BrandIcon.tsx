// src/app/components/mdx/BrandIcon.tsx
// 品牌图标组件：从 brand-icons.ts 里取出 svg path 与 viewBox，用内联 SVG 渲染。
// 全部离线，不请求任何图标 CDN（国内可正常显示）。
// 取不到对应图标时返回 null 而不是抛错：一个图标键写错不该让整页崩掉。

import { brandIcons, type BrandName } from "@/app/components/mdx/brand-icons";

type BrandIconProps = {
  name: BrandName;
  className?: string;
};

export default function BrandIcon({
  name,
  className = "h-4 w-4",
}: BrandIconProps) {
  const icon = brandIcons[name];

  // 兜底：brand-icons 里没有这个键时什么都不渲染（开发环境给出提示，方便发现拼写错误）
  if (!icon) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[BrandIcon] 未找到图标 "${name}"，请检查 brand-icons.ts 里的键名`,
      );
    }
    return null;
  }

  return (
    <svg
      viewBox={icon.viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}
