// src/app/components/ui/Reveal.tsx
// 通用入场动画容器：给子内容套一层 CSS 动画（淡入 + 上移）。
// 故意不用客户端动画库：静态导出时如果靠 JS 才能把 opacity 从 0 改回来，
// 那么 JS 没加载完（或失败）内容就是不可见的；这里交给 CSS keyframes，天然渐进增强。
// 动画定义在 src/app/styles/animations.css。

import type { ReactNode } from "react";

export default function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  // 延迟（秒），用于同一区域错峰入场
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  return (
    <Tag
      className={["animate-rise", className].filter(Boolean).join(" ")}
      style={delay > 0 ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
