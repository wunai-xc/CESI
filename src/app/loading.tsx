// src/app/loading.tsx
// 路由切换/数据加载时显示的 UI（Next 会自动把它包成 Suspense fallback）
export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
        <p className="text-sm text-zinc-500">加载中…</p>
      </div>
    </div>
  );
}
