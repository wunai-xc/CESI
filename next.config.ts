import type { NextConfig } from 'next'
import path from 'node:path'
import createMDX from '@next/mdx'

const isProduction = process.env.NODE_ENV === 'production'
const codeMetaPlugin = path.join(process.cwd(), 'src/app/lib/remark-code-meta.mjs')

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: isProduction,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-math', codeMetaPlugin],
    rehypePlugins: ['rehype-katex', 'rehype-highlight'],
  },
})

export default withMDX(nextConfig)
