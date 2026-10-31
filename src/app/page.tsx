// src/app/page.tsx
// 首页（路由 /）：hero 区，数据（文章数 / 字数 / 最近更新）在构建期算好传给 HomeHero。

import type { Metadata } from "next";
import { getAllPosts } from "@/app/content/posts";
import HomeHero from "@/app/components/HomeHero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const posts = getAllPosts();
  const wordCount = posts.reduce((sum, post) => sum + post.wordCount, 0);

  return (
    <HomeHero
      postCount={posts.length}
      wordCount={wordCount}
      latestDate={posts[0]?.date ?? ""}
    />
  );
}
