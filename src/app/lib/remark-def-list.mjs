// src/app/lib/remark-def-list.mjs
// remark 插件：支持定义列表，写法是
//   术语
//   : 定义内容
//   : 第二条定义
// 生成 <dl><dt>术语</dt><dd>定义</dd></dl>。
// remark-definition-list 需要在 remark-rehype 里额外注册 handlers，@next/mdx 不暴露那一步，
// 所以这里自己实现：把「术语行 + 若干以冒号开头的行」重组成 data.hName 为 dl / dt / dd 的节点。
//
// 注意：只处理「纯文本」的术语与定义（段内没有行内标记时会走这条快路径），
// 带粗体/链接等行内标记的定义请直接用 HTML：<dl><dt>…</dt><dd>…</dd></dl>。
// 注册在 next.config.ts 的 remarkPlugins 里（用绝对路径传入）。

// 定义项的行首标记：冒号 + 至少一个空白
const DEFINITION = /^:\s+/;

function textNode(value) {
  return { type: "text", value };
}

function paragraphWithTag(tagName, children) {
  return { type: "paragraph", data: { hName: tagName }, children };
}

// 情况一：术语和定义在同一个段落里，用换行分隔（remark 会把软换行保留在 text 节点的 \n 里）
function splitInlineDefinitionList(node) {
  const children = node.children;
  if (children.length !== 1 || children[0].type !== "text") return null;

  const lines = children[0].value.split("\n");
  if (lines.length < 2) return null;

  const definitionLines = lines.slice(1);
  if (!definitionLines.every((line) => DEFINITION.test(line))) return null;

  const term = lines[0].trim();
  if (!term) return null;

  return paragraphWithTag("dl", [
    paragraphWithTag("dt", [textNode(term)]),
    ...definitionLines.map((line) =>
      paragraphWithTag("dd", [textNode(line.replace(DEFINITION, "").trim())]),
    ),
  ]);
}

// 情况二：术语和定义是相邻的独立段落
function isDefinitionParagraph(node) {
  if (!node || node.type !== "paragraph" || !Array.isArray(node.children)) return false;
  const first = node.children[0];
  return Boolean(first && first.type === "text" && DEFINITION.test(first.value));
}

function toDefinition(node) {
  const children = [...node.children];
  children[0] = textNode(children[0].value.replace(DEFINITION, ""));

  return paragraphWithTag("dd", children);
}

export default function remarkDefList() {
  return (tree) => {
    if (!Array.isArray(tree.children)) return;

    const next = [];
    let index = 0;

    while (index < tree.children.length) {
      const node = tree.children[index];

      if (node.type !== "paragraph") {
        next.push(node);
        index += 1;
        continue;
      }

      // 先看段内换行写法
      const inline = splitInlineDefinitionList(node);
      if (inline) {
        next.push(inline);
        index += 1;
        continue;
      }

      // 再看相邻段落写法
      const definitions = [];
      let cursor = index + 1;
      while (cursor < tree.children.length && isDefinitionParagraph(tree.children[cursor])) {
        definitions.push(toDefinition(tree.children[cursor]));
        cursor += 1;
      }

      if (definitions.length === 0) {
        next.push(node);
        index += 1;
        continue;
      }

      next.push(
        paragraphWithTag("dl", [
          paragraphWithTag("dt", node.children),
          ...definitions,
        ]),
      );
      index = cursor;
    }

    tree.children = next;
  };
}
