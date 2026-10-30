import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/app/content/posts");

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

function normalizeDate(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") {
    const trimmed = value.trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
  }
  return null;
}

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

function loadPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .filter((fileName) => !fileName.startsWith("_"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const posts: Post[] = loadPosts();

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

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
