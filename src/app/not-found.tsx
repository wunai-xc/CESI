// src/app/not-found.tsx(404页面)
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="mb-4 text-6xl font-bold text-zinc-900 dark:text-zinc-50">
        404
      </h1>
      <h2 className="mb-6 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
        Page not found.（页面没有找到）
      </h2>
      <p className="mb-8 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        Sorry, the page you visited may have been deleted or the wrong URL was
        entered.（抱歉，您访问的页面可能已被删除或输入了错误的 URL。）
      </p>
      <Link
        href="/"
        className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Back（返回首页）
      </Link>
    </div>
  );
}
