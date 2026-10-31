// src/app/sitemap.ts
// 静态导出时由 Next 在构建期生成 /sitemap.xml。
// 收录：首页、文章列表、每篇文章、每个标签页、about/terms/privacy。
// 换域名只改 src/app/lib/site.ts 里的 SITE_URL。

import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/app/content/posts";
import { SITE_URL } from "@/app/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "/",
    "/components/posts",
    "/content/about",
    "/content/terms",
    "/content/privacy",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.6,
    })),
    ...getAllPosts().map((post) => ({
      url: `${SITE_URL}/components/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getAllTags().map(({ tag }) => ({
      url: `${SITE_URL}/components/posts/tag/${encodeURIComponent(tag)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
