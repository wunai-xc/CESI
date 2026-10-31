// src/app/components/posts/[slug]/page.tsx
// 文章详情页，路由 /components/posts/<slug>。
// 正文是 src/app/content/posts/<slug>.mdx，编译期由 MDX 转成 React 组件。
// 站点是静态导出（output: "export"），所有 slug 都在 generateStaticParams 里列全，
// 所以页面可以直接 await params，不需要 Suspense 边界。

import type { Metadata } from "next";
// 公式样式与 mhchem 只在这个路由加载，不拖累首页和列表页
import "katex/dist/contrib/mhchem.min.js";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdjacentPosts,
  getAllPosts,
  getPost,
  getPostHeadings,
  loadPostContent,
} from "@/app/content/posts";
import { formatDate } from "@/app/lib/formatDate";
import TagLink from "@/app/components/TagLink";
import PostToc from "@/app/components/PostToc";
import PostPager from "@/app/components/PostPager";
import BackToTop from "@/app/components/BackToTop";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

// 构建时把每篇文章预渲染成静态页面
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// 每篇文章自己的 title / description
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "文章不存在" };

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/components/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // 按 slug 动态加载对应的 .mdx
  const Content = await loadPostContent(slug);
  if (!Content) notFound();

  // 目录条目在服务端从同一份 .mdx 源文件里扫出来，锚点 id 与 rehype-slug 生成的一致
  const headings = getPostHeadings(slug);

  // 相邻文章用于底部翻页，缺哪一侧就在那一侧显示「全部文章」
  const { previous, next } = getAdjacentPosts(slug);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/components/posts"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← Back All Posts
      </Link>

      <PostToc headings={headings} />

      <article data-reading-target>
        <header className="mt-6 border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.wordCount.toLocaleString()} 字</span>
            {post.tags.map((tag) => (
              <TagLink key={tag} tag={tag} className="text-xs" />
            ))}
          </div>
        </header>

        {/* prose 来自 @tailwindcss/typography，一行类名把 markdown 排版好；
            正文字体用内联样式指向 --font-reading（阅读字体，不含站点字体 cesi-sans），
            这样不依赖额外 CSS 类，也不会被工具类或插件样式覆盖 */}
        <div
          className="prose prose-zinc mt-8 max-w-none dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 [&_.task-list-item]:list-none [&_.task-list-item]:pl-0 [&_.task-list-item>input]:mr-2 [&_.task-list-item>input]:align-middle [&_.task-list-item>input]:accent-blue-600 [&_[data-footnotes]]:mt-10 [&_[data-footnotes]]:border-t [&_[data-footnotes]]:border-zinc-200 [&_[data-footnotes]]:pt-4 [&_[data-footnotes]]:text-sm dark:[&_[data-footnotes]]:border-zinc-800"
          style={{ fontFamily: "var(--font-reading)" }}
        >
          <Content />
        </div>

        <PostPager previous={previous} next={next} />
      </article>

      <BackToTop />
    </div>
  );
}
