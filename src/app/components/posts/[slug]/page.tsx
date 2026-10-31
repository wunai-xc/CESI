import { Suspense } from "react";
import type { Metadata } from "next";
import "katex/dist/contrib/mhchem.min.js";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, loadPostContent, posts } from "@/app/content/posts";
import { formatDate } from "@/app/lib/formatDate";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "文章不存在" };
  return { title: post.title, description: post.summary };
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/components/posts"
        className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← Back All Posts
      </Link>

      <Suspense fallback={<PostSkeleton />}>
        <PostBody params={params} />
      </Suspense>
    </div>
  );
}

async function PostBody({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const Content = await loadPostContent(slug);
  if (!Content) notFound();

  return (
    <article>
      <header className="mt-6 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-500">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400">
        <Content />
      </div>
    </article>
  );
}

function PostSkeleton() {
  return (
    <div className="mt-6 animate-pulse">
      <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-3 h-4 w-40 bg-zinc-100 dark:bg-zinc-800/60" />
      <div className="mt-8 space-y-3">
        <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800/60" />
        <div className="h-4 w-11/12 bg-zinc-100 dark:bg-zinc-800/60" />
        <div className="h-4 w-4/5 bg-zinc-100 dark:bg-zinc-800/60" />
      </div>
    </div>
  );
}
