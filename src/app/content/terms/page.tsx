// src/app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "服务条款",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        服务条款
      </h1>

      <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
        <p>
          本站所有文章都是我个人的学习笔记，按「现状」提供，不保证内容完全正确、也不保证长期有效。
        </p>
        <p>
          文中代码可以自由参考使用，但请自行评估风险，出问题我不承担责任。
        </p>
        <p className="text-zinc-400">最后更新：2025-10</p>
      </div>
    </div>
  );
}
