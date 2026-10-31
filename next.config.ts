import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const isProduction = process.env.NODE_ENV === 'production'

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
    remarkPlugins: ['remark-frontmatter', 'remark-math'],
    rehypePlugins: ['rehype-katex'],
  },
})

export default withMDX(nextConfig)
