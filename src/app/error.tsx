// src/app/error.tsx
// 错误兜底页面。必须是客户端组件（React 的 error boundary 只能在客户端工作）。
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        出错了
      </h2>
      <p className="max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {error.message || "页面渲染时发生了意外错误。"}
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-zinc-400">digest: {error.digest}</p>
      )}

      {/* reset() 会重新渲染这一段路由，通常能恢复 */}
      <button
        type="button"
        onClick={() => reset()}
        className="bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        重试
      </button>
    </div>
  );
}
