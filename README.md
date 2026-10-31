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

- 列表页：`/components/posts`
- 详情页：`/components/posts/<slug>`

## 构建

```bash
npm run build
npm start
```
