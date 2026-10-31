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
- 写代码不要加注释（用户明确要求源码里不出现注释）。
- **全站不使用圆角**：不要用 `rounded-*`（`rounded`、`rounded-md`、`rounded-full` 等）工具类，按钮、卡片、图片、标签一律方角。
- 不要用 `cp -al` / 硬链接方式复制项目：这个 Android proot 环境用 link2symlink 模拟硬链接，会把项目文件改成 `.l2s.*` 链接对，误删就会丢文件。
- 删除文件前先确认路径，不要对项目目录做模糊匹配的批量删除。

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
