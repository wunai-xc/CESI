// src/app/components/post/DraftBadge.tsx
// 草稿标记：只在开发环境（draft: true 的文章会被读进列表）出现，
// 防止把草稿当成已发布文章看。生产构建时草稿整篇不会被打包，组件也就用不上。

export default function DraftBadge() {
  return (
    <span
      title="草稿：只在 dev 可见，构建时会被排除"
      className="inline-block border border-amber-500/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-600 dark:border-amber-400/50 dark:text-amber-400"
    >
      draft
    </span>
  );
}
