// next.config.ts
// Next.js 配置：MDX 管线（frontmatter / 数学公式 / 代码高亮 / 代码块元数据）、
// Tailwind 的 Turbopack 加载器、PPR（cacheComponents）以及只在生产启用的 React Compiler。

import type { NextConfig } from 'next'
import path from 'node:path'
import createMDX from '@next/mdx'

// React Compiler 编译很慢，只留给生产构建；dev 关掉以加快启动与热更新
const isProduction = process.env.NODE_ENV === 'production'

// @next/mdx 的 loader 用 require.resolve 解析插件字符串，相对路径会从 loader 目录找，
// 所以这里传绝对路径
const codeMetaPlugin = path.join(process.cwd(), 'src/app/lib/remark-code-meta.mjs')

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  // 启用 Cache Components（PPR）：页面里读 params/cookies 等必须在 Suspense 内
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: isProduction,
  turbopack: {
    rules: {
      // 让 Turbopack 用 Tailwind 的 loader 处理 CSS（Tailwind v4 的 CSS-first 用法）
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // .mdx 也当成页面/模块处理
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    // frontmatter 剥 YAML 头；remark-gfm 提供表格/删除线/自动链接等 GFM 语法；
    // 公式走 remark-math；codeMeta 把围栏元数据转成 data-* 属性
    remarkPlugins: ['remark-frontmatter', 'remark-gfm', 'remark-math', codeMetaPlugin],
    // 公式渲染 + 标题锚点 + 代码高亮，全部在编译期完成，客户端不跑高亮库
    rehypePlugins: ['rehype-katex', 'rehype-slug', 'rehype-highlight'],
  },
})

export default withMDX(nextConfig)
