<!-- cesi/README.md -->

# cesi

WUNAI 的个人站点，使用 Next.js 16 + MDX + Tailwind CSS v4 搭建。

## 开发

```bash
npm install
npm run dev
```

打开 http://127.0.0.1:3000 。

## 文章

文章写在 `src/app/content/posts/<slug>.mdx`，frontmatter 需要 `title`、`date`（`YYYY-MM-DD`），可选 `summary`、`tags`。

```mdx
---
title: Hello World
date: "2025-10-20"
summary: 摘要
tags: [Next.js, MDX]
---
```

- 首页：`/`（分三段：hero / 最近更新 / 关于，第 2、3 段随滚动淡入）
- 列表页：`/components/posts`
- 详情页：`/components/posts/<slug>`
- 标签页：`/components/posts/tag/<tag>`

## 构建与部署

站点是**静态导出**（`next.config.ts` 里 `output: "export"`），构建产物在 `out/`：

```bash
npm run build
```

### 方案一：Cloudflare Pages（推荐）

新建一个 **Pages** 项目（不是 Workers），连这个仓库：

- Framework preset：**None**
- Build command：`npm run build`
- Build output directory：`out`
- 环境变量：不需要（构建期会把文章编译进 HTML）
- 自定义域名：Pages 项目 → Custom domains → `newbl.wunai.top`

### 方案二：Cloudflare Workers（静态资源）

仓库里的 `wrangler.jsonc` 已经把 `out/` 当作静态资源发布，不跑任何 Worker 脚本。
Workers 项目里要把 **Framework preset 改成 None**，否则 Cloudflare 会按 Next.js 处理、
自动塞 OpenNext 并改写 package.json 脚本（那条路对静态导出没用）：

- Build command：`npm run build`
- Deploy command：`npx wrangler deploy`
- 自定义域名：Worker → Settings → Domains & Routes → `newbl.wunai.top`

因为不受任何适配器约束，纯静态产物也可以直接丢到任何静态托管。

注意静态导出下**不能**使用请求期动态能力（PPR / ISR / `cookies()` / `headers()` / `connection()`），
文章新增后需要重新构建才会出现在线上。
