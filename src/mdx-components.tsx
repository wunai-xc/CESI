// src/mdx-components.tsx
// @next/mdx 要求的组件映射文件（必须放在 src 根目录）。
// 这里把 MDX 里的原生标签换成带样式的版本，并注册可在正文里直接用的组件（Callout / CodeBlock）。

import { isValidElement } from "react";
import type { MDXComponents } from "mdx/types";
import Callout from "@/app/components/Callout";
import CodeBlock from "@/app/components/CodeBlock";

const components: MDXComponents = {
  Callout,

  CodeBlock,

  // 代码块外壳：从 <code> 的 data-* 里取出 remark-code-meta 写入的文件名/版本信息
  pre: ({ children }) => {
    const child = Array.isArray(children) ? children[0] : children;
    const data = isValidElement<Record<string, string>>(child)
      ? child.props
      : {};

    return (
      <CodeBlock
        filename={data["data-filename"]}
        language={data["data-language"]}
        languageVersion={data["data-language-version"]}
        runtime={data["data-runtime"]}
        runtimeVersion={data["data-runtime-version"]}
      >
        {children}
      </CodeBlock>
    );
  },

  // 代码：行内代码加底色和边框；块级代码（有 language- 或 hljs 类）交给高亮结果，不再套样式
  code: ({ className, ...props }) => {
    const isBlockCode =
      typeof className === "string" &&
      (className.includes("language-") || className.includes("hljs"));

    if (isBlockCode) {
      const cleaned = Object.fromEntries(
        Object.entries(props).filter(([key]) => !key.startsWith("data-")),
      );
      return (
        <code
          className={className}
          {...(cleaned as React.HTMLAttributes<HTMLElement>)}
        />
      );
    }

    return (
      <code
        {...props}
        className={[
          "not-prose border border-zinc-200 px-1.5 py-0.5 font-mono text-[0.9em]",
          "bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
          className ?? "",
        ].join(" ")}
      />
    );
  },

  // 表格外面套一层横向滚动容器，窄屏不会撑破布局
  table: (props) => (
    <div className="my-6 w-full overflow-x-auto border border-zinc-200 dark:border-zinc-800">
      <table {...props} />
    </div>
  ),

  // 外链自动加 target/rel，站内链接保持默认行为
  a: ({ href, ...props }) => {
    const isExternal = typeof href === "string" && href.startsWith("http");
    return (
      <a
        href={href}
        {...props}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      />
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
