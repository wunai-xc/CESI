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

      if (node.lang) props["data-language"] = node.lang;

      for (const match of meta.matchAll(/([\w-]+)=("[^"]*"|'[^']*'|\S+)/g)) {
        const key = match[1].replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        const value = match[2].replace(/^["']|["']$/g, "");
        props[`data-${key}`] = value;
      }
    });
  };
}
