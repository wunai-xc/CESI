// src/app/lib/remark-heading-id.mjs
// remark 插件：支持在标题末尾手写锚点 id，写法是
//   ## 小标题 {#custom-id}
// 解析后把 {#custom-id} 从标题文字里去掉，并把 id 写进 hProperties。
// rehype-slug 只会给「还没有 id」的标题补自动 id，所以手写 id 优先生效。
// 注册在 next.config.ts 的 remarkPlugins 里（用绝对路径传入）。

// 标题末尾的 {#id}，id 允许字母、数字、下划线、短横线
const CUSTOM_ID = /\s*\{#([\w-]+)\}\s*$/;

function walk(node) {
  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    if (child.type === "heading" && Array.isArray(child.children)) {
      const last = child.children[child.children.length - 1];
      if (last && last.type === "text") {
        const match = CUSTOM_ID.exec(last.value);
        if (match) {
          last.value = last.value.replace(CUSTOM_ID, "");
          child.data = child.data || {};
          child.data.hProperties = child.data.hProperties || {};
          child.data.hProperties.id = match[1];
        }
      }
      continue;
    }

    walk(child);
  }
}

export default function remarkHeadingId() {
  return (tree) => {
    walk(tree);
  };
}
