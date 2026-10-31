// src/app/lib/remark-mark.mjs
// remark 插件：支持 ==高亮== 语法，输出 <mark> 元素。
// 官方 GFM 没有高亮标记，这里自己实现：把文本节点里的 ==内容== 切成
// 「普通文本 + hName 为 mark 的节点」，mdast-util-to-hast 会把 hName 当作标签名输出。
// 注册在 next.config.ts 的 remarkPlugins 里（用绝对路径传入）。

// 匹配 ==内容==：内容里不允许再出现 =，避免把 === 之类误判
const MARK = /==([^=\n]+)==/g;

function splitText(node) {
  const value = node.value;
  if (typeof value !== "string" || !value.includes("==")) return [node];

  const parts = [];
  let lastIndex = 0;
  MARK.lastIndex = 0;

  for (const match of value.matchAll(MARK)) {
    const start = match.index;
    if (start > lastIndex) {
      parts.push({ type: "text", value: value.slice(lastIndex, start) });
    }

    parts.push({
      type: "emphasis",
      // hName 让 mdast 直接映射成 <mark>，不再依赖 raw HTML（MDX 不支持 raw HTML）
      data: { hName: "mark" },
      children: [{ type: "text", value: match[1] }],
    });

    lastIndex = start + match[0].length;
  }

  if (lastIndex < value.length) {
    parts.push({ type: "text", value: value.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [node];
}

function walk(node) {
  if (!Array.isArray(node.children)) return;

  const next = [];
  for (const child of node.children) {
    // 不处理代码里、链接地址里的 ==；只处理普通文本节点
    if (child.type === "text") {
      next.push(...splitText(child));
      continue;
    }

    if (child.type !== "inlineCode" && child.type !== "code") {
      walk(child);
    }
    next.push(child);
  }

  node.children = next;
}

export default function remarkMark() {
  return (tree) => {
    walk(tree);
  };
}
