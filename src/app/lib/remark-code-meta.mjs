// src/app/lib/remark-code-meta.mjs
// remark 插件：把围栏代码块后面的元数据写进 data-* 属性。
// 例如 ```ts filename="a.ts" runtime=Node runtimeVersion=22 会变成
// data-language / data-filename / data-runtime / data-runtime-version，
// 再由 src/mdx-components.tsx 的 pre 取出来交给 CodeBlock 显示。
// 注册在 next.config.ts 的 remarkPlugins 里（用绝对路径传入）。

// 简易深度遍历，只关心 type === "code" 的节点
function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (node.type === "code") visit(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, visit);
  }
}

export default function remarkCodeMeta() {
  return (tree) => {
    walk(tree, (node) => {
      const meta = typeof node.meta === "string" ? node.meta : "";
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      const props = node.data.hProperties;

      // 语言标识来自围栏本身（```ts 里的 "ts"）
      if (node.lang) props["data-language"] = node.lang;

      // 解析 key=value 或 key="带空格的值"，驼峰键名转成 data- 短横线形式
      for (const match of meta.matchAll(/([\w-]+)=("[^"]*"|'[^']*'|\S+)/g)) {
        const key = match[1].replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        const value = match[2].replace(/^["']|["']$/g, "");
        props[`data-${key}`] = value;
      }
    });
  };
}
