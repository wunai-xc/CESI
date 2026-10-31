// src/app/content/posts.ts
// 文章数据层：启动时扫描 src/app/content/posts/*.mdx，用 gray-matter 读 frontmatter，
// 供列表页 / 详情页取元数据，并按需动态 import 对应的 MDX 正文组件。

import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import matter from "gray-matter";

// 文章目录（以 _ 开头的文件会被忽略，可用来放草稿）
const POSTS_DIR = path.join(process.cwd(), "src/app/content/posts");

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

// frontmatter 里的 date 允许写成日期对象或 "YYYY-MM-DD" 字符串，统一成字符串
function normalizeDate(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") {
    const trimmed = value.trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
  }
  return null;
}

// tags 支持数组写法，也支持 "a, b、c" 这种中英文逗号/顿号分隔的字符串
function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,，、]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

// 读单个文件：解析 frontmatter，缺关键字段直接抛错，方便写作时立刻发现
function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.mdx$/, "");
  const filePath = path.join(POSTS_DIR, fileName);
  const { data } = matter(fs.readFileSync(filePath, "utf8"));

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const date = normalizeDate(data.date);
  const summary = typeof data.summary === "string" ? data.summary.trim() : "";

  const missing: string[] = [];
  if (!title) missing.push("title");
  if (!date) missing.push('date（写成 "2025-10-20" 这种格式）');
  if (missing.length > 0) {
    throw new Error(
      `文章 ${fileName} 的 frontmatter 有问题：缺少或格式不对 → ${missing.join("、")}`,
    );
  }

  return {
    slug,
    title,
    date: date as string,
    summary,
    tags: normalizeTags(data.tags),
  };
}

// 扫描整个目录，按日期倒序（新的在前）
function loadPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .filter((fileName) => !fileName.startsWith("_"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// 模块加载时算一次，构建期就把列表定下来
export const posts: Post[] = loadPosts();

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

// 动态 import 对应 slug 的 MDX；文件不存在或编译失败时返回 null（由页面转 404）
export async function loadPostContent(
  slug: string,
): Promise<ComponentType | null> {
  if (!getPost(slug)) return null;

  try {
    const mod = await import(`@/app/content/posts/${slug}.mdx`);
    return (mod as { default?: ComponentType }).default ?? null;
  } catch {
    return null;
  }
}
