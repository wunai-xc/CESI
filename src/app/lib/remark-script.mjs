// src/app/lib/remark-script.mjs
// remark 插件：支持下标 ~x~ 和上标 ^x^。
// 与 remark-mark 同一套做法：把命中片段换成 data.hName 为 sub / sup 的节点，
// mdast-util-to-hast 会把 hName 当作标签名输出，不需要 raw HTML（MDX 不支持 raw HTML）。
// 注意：~~删除线~~ 会被 remark-gfm 先解析成 delete 节点，不会再落到这里。
// 注册在 next.config.ts 的 remarkPlugins 里（用绝对路径传入）。

// 第一个捕获组是上标内容，第二个是下标内容；两组互斥
const PATTERN = /\^([^\s^][^^\n]*?)\^|~([^\s~][^~\n]*?)~/g;

function makeNode(tagName, value) {
  return {
    type: "emphasis",
    data: { hName: tagName },
    children: [{ type: "text", value }],
  };
}

function splitText(value) {
  if (!value.includes("^") && !value.includes("~")) {
    return [{ type: "text", value }];
  }

  const parts = [];
  let lastIndex = 0;

  for (const match of value.matchAll(PATTERN)) {
    const start = match.index;
    const raw = match[0];
    const isSuperscript = match[1] !== undefined;

    if (start > lastIndex) {
      parts.push({ type: "text", value: value.slice(lastIndex, start) });
    }

    parts.push(makeNode(isSuperscript ? "sup" : "sub", isSuperscript ? match[1] : match[2]));
    lastIndex = start + raw.length;
  }

  if (parts.length === 0) return [{ type: "text", value }];
  if (lastIndex < value.length) {
    parts.push({ type: "text", value: value.slice(lastIndex) });
  }

  return parts;
}

function walk(node) {
  if (!Array.isArray(node.children)) return;

  const next = [];
  for (const child of node.children) {
    if (child.type === "text") {
      next.push(...splitText(child.value));
      continue;
    }

    // 代码里的 ~ ^ 保持原样
    if (child.type !== "inlineCode" && child.type !== "code") {
      walk(child);
    }
    next.push(child);
  }

  node.children = next;
}

export default function remarkScript() {
  return (tree) => {
    walk(tree);
  };
}
