<!-- cesi/AGENTS.md -->
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 本项目给 agent 的硬性规则

- **不要运行 `npm run dev` / `next dev` / `npm run build` / `next build`**，也不要启动任何服务器或长时间的编译器进程。dev 和 build 由用户自己开、自己看终端。
- 不要用后台 `nohup` / `setsid` 拉起 dev 或 build 来"顺便验证"。
- **不要 kill 任何不是自己启动的进程**，尤其是用户的 `next dev`。需要重启时先告诉用户，由用户操作。
- 需要验证改动时，只用静态检查：`./node_modules/.bin/tsc --noEmit`、`npm run lint`，以及读文件、读 `node_modules/next/dist/docs/` 里的文档。
- 如果某项改动非跑起来才能确认，就在回复里写清楚"请自行运行 `npm run dev` 并看 XXX"，然后停下，不要自己跑。
- **每个文件第一行都要有文件路径注释**（例：`// src/app/page.tsx`、`/* src/app/styles/tokens.css */`）；**MDX 文件不写注释**（frontmatter 必须占首行，正文里的 `{/* … */}` 也不要加）；JSON 文件不能写注释，跳过。
- **代码要有注释说明**：文件头写清这个文件干什么，关键逻辑、不直观的取值（魔法数字、兼容写法、workaround）都要解释清楚，注释用中文。
- **按钮文案以英文为主体**：站内所有按钮 / 可点击控件一律用英文（`Copy`、`Settings`、`Retry`…），**不要单独使用中文按钮**；空间宽裕时用「英文 + 中文」并列（例：`Settings 设置`、`Retry 重试`），空间紧张时只留英文。导航链接同理（`All posts`、`About`）。
- **全站不使用圆角**：不要用 `rounded-*`（`rounded`、`rounded-md`、`rounded-full` 等）工具类，按钮、卡片、图片、标签一律方角。
- 不要用 `cp -al` / 硬链接方式复制项目：这个 Android proot 环境用 link2symlink 模拟硬链接，会把项目文件改成 `.l2s.*` 链接对，误删就会丢文件。
- 删除文件前先确认路径，不要对项目目录做模糊匹配的批量删除。

## 样式文件结构（`src/app/styles/`）

`layout.tsx` 只 import `globals.css` 一个入口，其余文件通过 `@import` 引入：

- `globals.css`：入口，只放 `@import "tailwindcss"`、`@import` 其他分片、`@plugin`、`@custom-variant dark`、`@theme inline` 和 `body` 基础样式
- `fonts.css`：`@font-face`
- `tokens.css`：颜色 / 字体变量与 `.dark` 覆盖
- `syntax.css`：代码高亮（hljs）配色

加载动画（`src/app/components/SweepLoader.tsx`）用 Web Animations API 在客户端跑，不写在 CSS 里。

新增样式按这个划分放对应文件，不要再往 `globals.css` 里堆。

## 文章里的代码块写法

围栏代码块后面可以带元数据，会显示在代码块头部的信息栏里：

````md
```ts filename="src/app/content/posts.ts" runtime=Node runtimeVersion=22.23.4 languageVersion=5.9
export const posts = loadPosts();
```
````

- `filename`：文件名
- `runtime` / `runtimeVersion`：运行环境与版本（程序版本）
- `languageVersion`：语言版本
- 语言名由围栏的 `ts` / `bash` / `json` 等自动映射为 TypeScript / Bash / JSON

元数据由 `src/app/lib/remark-code-meta.mjs` 写进 `data-*` 属性，`src/mdx-components.tsx` 的 `pre` 读出来传给 `src/app/components/CodeBlock.tsx`；高亮由 `rehype-highlight` 在编译期完成，不跑客户端 JS。

## MDX 支持的语法

| 语法 | 写法 | 由谁实现 |
| --- | --- | --- |
| 表格 / 删除线 / 任务列表 / 脚注 / 自动链接 | GFM 标准写法 | `remark-gfm`（`singleTilde: false`，把单波浪线留给下标） |
| 高亮 | `==文字==` | `src/app/lib/remark-mark.mjs` |
| 下标 / 上标 | `~2~` / `^2^` | `src/app/lib/remark-script.mjs` |
| 定义列表 | `术语` 换行 `: 定义` | `src/app/lib/remark-def-list.mjs` |
| 标题自定义 id | `## 标题 \{#custom\}`（MDX 里花括号要转义） | `src/app/lib/remark-heading-id.mjs` |
| 标题自动 id | 标题文字自动 slug | `rehype-slug` |
| 代码高亮 | 围栏代码块 | `rehype-highlight` |
| 公式 | `$…$` / `$$…$$` | `remark-math` + `rehype-katex` |
| 代码块元数据 | 围栏后跟 `filename=… runtime=…` | `src/app/lib/remark-code-meta.mjs` |

## 表格

- 表格是 GFM 语法，必须有表头 + 分隔行：`| a | b |` / `| --- | --- |` / 数据行。
- 想在「效果」列展示真实渲染结果（标题、粗体、链接等）时，**单元格里直接写 JSX**：`<h1>H1</h1>`、`<strong>粗体</strong>`、`<em>斜体</em>`、`<a href="…">链接</a>`。
  Markdown 的块级语法（`#`、列表、代码块）在表格单元格里不生效，因为 GFM 单元格只解析行内内容。
