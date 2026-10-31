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

  // 表格：外层横向滚动容器（窄屏不撑破布局）+ not-prose 接管样式，避免和 typography 的极简表格样式打架。
  // 单元格留白、表头底色、斑马纹、行分隔线都用 arbitrary variant 写在 table 上，一处维护。
  table: (props) => (
    <div className="not-prose my-6 w-full overflow-x-auto border border-zinc-200 dark:border-zinc-800">
      <table
        {...props}
        className={[
          "w-full border-collapse text-left text-sm leading-6",
          // 单元格：内收缩进 16px，上下 10px
          "[&_th]:px-4 [&_th]:py-2.5 [&_td]:px-4 [&_td]:py-2.5",
          // 表头：浅底、加粗、行首不换行
          "[&_th]:bg-zinc-100 [&_th]:font-semibold [&_th]:whitespace-nowrap",
          "[&_th]:text-zinc-900 [&_td]:align-top [&_td]:text-zinc-700",
          // 行分隔线：只画在单元格底部，最后一行去掉避免和容器边框重叠
          "[&_th]:border-b [&_th]:border-zinc-200 [&_td]:border-b [&_td]:border-zinc-200",
          "[&_tbody_tr:last-child>*]:border-b-0",
          // 斑马纹，长表格更好读
          "[&_tbody_tr:nth-child(even)]:bg-zinc-50",
          // 暗色
          "dark:[&_th]:bg-zinc-900 dark:[&_th]:text-zinc-100 dark:[&_td]:text-zinc-300",
          "dark:[&_th]:border-zinc-800 dark:[&_td]:border-zinc-800",
          "dark:[&_tbody_tr:nth-child(even)]:bg-zinc-900/40",
        ].join(" ")}
      />
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
