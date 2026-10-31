import { isValidElement } from "react";
import type { MDXComponents } from "mdx/types";
import Callout from "@/app/components/Callout";
import CodeBlock from "@/app/components/CodeBlock";

const components: MDXComponents = {
  Callout,

  CodeBlock,

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

  table: (props) => (
    <div className="my-6 w-full overflow-x-auto border border-zinc-200 dark:border-zinc-800">
      <table {...props} />
    </div>
  ),

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
