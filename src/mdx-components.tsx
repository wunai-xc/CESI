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
          // whitespace-nowrap：行内代码不跨行断开（表格、正文、列表里都一样）
          "whitespace-nowrap align-baseline",
          "bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
          className ?? "",
        ].join(" ")}
      />
    );
  },

  // 高亮 ==文字==：黄色底，暗色降亮度
  mark: (props) => (
    <mark
      {...props}
      className="bg-yellow-200/80 px-0.5 text-inherit dark:bg-yellow-400/30"
    />
  ),

  // 定义列表：术语加粗、定义缩进并用左侧细线区分
  dl: (props) => <dl {...props} className="my-5" />,
  dt: (props) => (
    <dt {...props} className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100" />
  ),
  dd: (props) => (
    <dd
      {...props}
      className="mt-1 border-l-2 border-zinc-200 pl-3 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
    />
  ),

  // 上下标：不改变默认行为，只把字号相对化，便于在正文行高里对齐
  sub: (props) => <sub {...props} className="text-[0.75em]" />,
  sup: (props) => <sup {...props} className="text-[0.75em]" />,

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
          // 单元格里常用来演示渲染效果（<h1>~<h4>、链接），把标题外边距清掉并压一点字号，
          // 否则 h1 在 14px 的表格里会显得过大
          "[&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0 [&_h4]:m-0 [&_p]:m-0",
          "[&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base",
          "[&_a]:text-blue-600 [&_a]:underline dark:[&_a]:text-blue-400",
          // 单元格里演示列表 / 图片时，把默认外边距和列表符号归一化，否则缩进会很难看
          "[&_ol]:m-0 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-5",
          "[&_li]:my-0.5 [&_img]:my-0 [&_img]:inline [&_img]:h-auto [&_img]:max-w-full [&_hr]:my-2",
          // 单元格里嵌套的 table / blockquote 是原样 HTML，不走组件映射，这里统一补上基本版式
          "[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
          "[&_blockquote]:m-0 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-3 dark:[&_blockquote]:border-zinc-700",
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
