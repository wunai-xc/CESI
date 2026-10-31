// next.config.ts
// Next.js 配置：MDX 管线（frontmatter / 数学公式 / 代码高亮 / 代码块元数据）、
// Tailwind 的 Turbopack 加载器、静态导出（部署到 Cloudflare Pages）
// 以及只在生产启用的 React Compiler。

import type { NextConfig } from 'next'
import path from 'node:path'
import createMDX from '@next/mdx'

// React Compiler 编译很慢，只留给生产构建；dev 关掉以加快启动与热更新
const isProduction = process.env.NODE_ENV === 'production'

// @next/mdx 的 loader 用 require.resolve 解析插件字符串，相对路径会从 loader 目录找，
// 所以本地插件一律传绝对路径
const libPlugin = (name: string) => path.join(process.cwd(), 'src/app/lib', name)
const codeMetaPlugin = libPlugin('remark-code-meta.mjs')
const markPlugin = libPlugin('remark-mark.mjs')
const scriptPlugin = libPlugin('remark-script.mjs')
const defListPlugin = libPlugin('remark-def-list.mjs')
const headingIdPlugin = libPlugin('remark-heading-id.mjs')

const nextConfig: NextConfig = {
  // 静态导出：构建产物是纯 HTML/CSS/JS，直接扔 Cloudflare Pages，不需要任何适配器。
  // 代价是不能用 PPR / ISR / 请求期动态数据，所以下面关掉了 cacheComponents 与 partialPrefetching。
  output: 'export',
  // 静态托管没有图片优化服务，next/image 退化成普通 <img>
  images: {
    unoptimized: true,
  },
  experimental: {
    agentFeedback: true,
  },
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
    remarkPlugins: [
      // 剥 YAML 头
      'remark-frontmatter',
      // GFM：表格、删除线、任务列表、脚注、自动链接；
      // singleTilde 关掉，否则 ~2~ 会被当成删除线，下标就没法用了
      ['remark-gfm', { singleTilde: false }],
      // 公式
      'remark-math',
      // 以下四个是本地插件：==高亮==、~下标~ / ^上标^、定义列表、标题自定义 id
      markPlugin,
      scriptPlugin,
      defListPlugin,
      headingIdPlugin,
      // 围栏代码块的元数据（文件名/版本）转成 data-* 属性
      codeMetaPlugin,
    ],
    // 公式渲染 + 标题锚点 + 代码高亮，全部在编译期完成，客户端不跑高亮库
    rehypePlugins: ['rehype-katex', 'rehype-slug', 'rehype-highlight'],
  },
})

export default withMDX(nextConfig)
