// src/app/content/about/page.tsx
// 关于页，路由 /content/about。目前只是占位框架，正文待补。

import type { Metadata } from "next";

// 页面标题与描述（模板 "%s | cesi" 会自动套上站点后缀）
export const metadata: Metadata = {
  title: "About Me.",
  description: "My WebID WuNai_XC",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h2 className="font-bold text-5xl">
        About Me.
      </h2>
      <p className="m-8">
        我的网名是<span className="font-bold m-1">wunai-xc</span>，现实中我居住在china，渭南市
      </p>
      <p className="">由于一些个人原因以及家庭原因，我不擅长社交</p>
    </div>
  )
}
