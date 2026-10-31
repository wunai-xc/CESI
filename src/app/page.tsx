// src/app/page.tsx
// 首页（路由 /）：分三段——
//   1) hero：渐变标题 + 打字机标语 + 入口按钮 + 下滑提示
//   2) 最近更新：三篇文章 + 全站统计
//   3) 关于 + 联系
// 数据（篇数 / 字数 / 最近日期）在构建期算好传给各段。

import type { Metadata } from "next";
import { getAllPosts } from "@/app/content/posts";
import HomeHero from "@/app/components/HomeHero";
import HomeLatest from "@/app/components/HomeLatest";
import HomeAbout from "@/app/components/HomeAbout";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const posts = getAllPosts();
  const totalWords = posts.reduce((sum, post) => sum + post.wordCount, 0);

  return (
    <div className="flex flex-1 flex-col">
      <HomeHero
        postCount={posts.length}
        wordCount={totalWords}
        latestDate={posts[0]?.date ?? ""}
      />
      <HomeLatest posts={posts} totalWords={totalWords} />
      <HomeAbout />
    </div>
  );
}
