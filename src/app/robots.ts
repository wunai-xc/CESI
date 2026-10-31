// src/app/robots.ts
// 静态导出时由 Next 在构建期生成 /robots.txt，指向 sitemap。

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

// 静态导出必须显式声明为静态，否则构建时会报
// "export const dynamic = force-static not configured on route /robots.txt"
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
