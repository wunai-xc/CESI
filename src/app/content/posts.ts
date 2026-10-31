// src/app/content/posts.ts
// 文章数据层：启动时扫描 src/app/content/posts/*.mdx，用 gray-matter 读 frontmatter，
// 供列表页 / 详情页取元数据，并按需动态 import 对应的 MDX 正文组件。

import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

// 文章目录（以 _ 开头的文件会被忽略，可用来放草稿）
const POSTS_DIR = path.join(process.cwd(), "src/app/content/posts");

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  // 正文字数（不含 frontmatter、代码块和 markdown 标记）
  wordCount: number;
};

// 文章目录条目：id 与正文标题上的锚点一致（rehype-slug 用同一套算法生成）
export type PostHeading = {
  id: string;
  text: string;
  depth: number;
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

// 统计正文字数：中文按字算，英文/数字按词算。
// 先剥掉代码块、行内代码、图片、链接地址、HTML/JSX 标签、MDX 表达式和 markdown 标记，
// 只对真正的正文文字计数。
function countWords(content: string): number {
  const stripped = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/[#>*_~|\\-]/g, " ");

  const cjk = stripped.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g)?.length ?? 0;
  const latin =
    stripped.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;

  return cjk + latin;
}

// 读单个文件：解析 frontmatter。缺关键字段时打印警告并跳过这篇，
// 不抛异常——一篇文章写坏不该把整站（首页、列表页、其它文章）一起搞崩。
function readPost(fileName: string): Post | null {
  const slug = fileName.replace(/\.mdx$/, "");
  const filePath = path.join(POSTS_DIR, fileName);
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const date = normalizeDate(data.date);
  const summary = typeof data.summary === "string" ? data.summary.trim() : "";

  const missing: string[] = [];
  if (!title) missing.push("title");
  if (!date) missing.push('date（写成 "2025-10-20" 这种格式）');
  if (missing.length > 0) {
    console.warn(
      `[posts] 跳过 ${fileName}：frontmatter 缺少或格式不对 → ${missing.join("、")}`,
    );
    return null;
  }

  return {
    slug,
    title,
    date: date as string,
    summary,
    tags: normalizeTags(data.tags),
    wordCount: countWords(content),
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
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// 目录签名：文件名 + 各自的 mtime。
// dev 下把目录里新增/删除/改动的文章算进签名，签名变了才重新扫描——
// 否则模块只会在服务启动时执行一次，新加的文章要重启 dev 才出现。
let cachedPosts: Post[] | null = null;
let cachedSignature = "";

// 文件系统只在构建期（和 dev 的每次请求）可用；部署到 Workers / Serverless 运行时时沒有 fs，
// 所以生产环境下不做目录签名检查，第一次扫完就固定下来，后续全部走缓存。
const isDev = process.env.NODE_ENV === "development";

function directorySignature(): string {
  if (!fs.existsSync(POSTS_DIR)) return "";

  return fs
    .readdirSync(POSTS_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => `${fileName}:${fs.statSync(path.join(POSTS_DIR, fileName)).mtimeMs}`)
    .join("|");
}

// 取得文章列表（带缓存，目录变化后自动失效）。生产构建时只算一次。
export function getAllPosts(): Post[] {
  // 生产 / 构建期：只扫一次，之后不再碰 fs
  if (!isDev && cachedPosts) return cachedPosts;

  const signature = isDev ? directorySignature() : "";

  if (!cachedPosts || signature !== cachedSignature) {
    cachedPosts = loadPosts();
    cachedSignature = signature;
  }

  return cachedPosts;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

// 标签系统：统计所有标签及其文章数（按数量倒序，同数量按名称排），供列表页标签栏和标签路由用
export type PostTag = {
  tag: string;
  count: number;
};

export function getAllTags(): PostTag[] {
  const counts = new Map<string, number>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// 取某个标签下的文章（保持日期倒序）
export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

// 相邻文章（用于底部「上篇 / 下篇」）：
// posts 已按日期倒序，所以 index + 1 是更早发布的一篇（上一篇），index - 1 是更晚的一篇（下一篇）
export type AdjacentPosts = {
  previous?: Post;
  next?: Post;
};

export function getAdjacentPosts(slug: string): AdjacentPosts {
  const list = getAllPosts();
  const index = list.findIndex((post) => post.slug === slug);
  if (index === -1) return {};

  return {
    previous: list[index + 1],
    next: list[index - 1],
  };
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

// 去掉标题里的 markdown 标记，只留可读文本
function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

// 扫描正文里的一级~四级标题生成目录。
// 注意：slugger 必须对所有标题（含 h1/h4）依次调用，才能和 rehype-slug 给正文生成的 id 完全对应，
// 但只把 h2/h3 放进返回结果（h1 通常是文章标题的重复）。
export function getPostHeadings(slug: string): PostHeading[] {
  if (!getPost(slug)) return [];

  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  let source = "";
  try {
    source = matter(fs.readFileSync(filePath, "utf8")).content;
  } catch {
    return [];
  }

  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];
  let inFence = false;

  for (const line of source.split("\n")) {
    // 围栏代码块内的 # 不是标题
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,4})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const text = stripMarkdown(match[2]);
    if (!text) continue;

    const depth = match[1].length;
    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) {
      headings.push({ id, text, depth });
    }
  }

  return headings;
}
