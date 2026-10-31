// src/app/content/about/page.tsx
// 关于页，路由 /content/about。目前只是占位框架，正文待补。

import type { Metadata } from "next";

// 页面标题与描述（模板 "%s | cesi" 会自动套上站点后缀）
export const metadata: Metadata = {
  title: "About Me.",
  description: "My WebID WuNai_XC",
};

export default function AboutPage() {
  return <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12" />;
}
