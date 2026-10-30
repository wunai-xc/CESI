import type { MDXComponents } from "mdx/types";
import Callout from "@/app/components/Callout";

const components: MDXComponents = {
  Callout,

  pre: ({ className, ...props }) => (
    <pre
      {...props}
      className={[
        "not-prose my-6 overflow-x-auto rounded-xl border p-4 text-[13px] leading-6",
        "border-zinc-200 bg-zinc-50 text-zinc-800",
        "dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
        "[&_code]:bg-transparent [&_code]:p-0 [&_code]:font-mono [&_code]:text-inherit",
        className ?? "",
      ].join(" ")}
    />
  ),

  code: ({ className, ...props }) => {
    const isBlockCode =
      typeof className === "string" && className.includes("language-");

    if (isBlockCode) {
      return <code className={className} {...props} />;
    }

    return (
      <code
        {...props}
        className={[
          "not-prose rounded px-1.5 py-0.5 font-mono text-[0.9em]",
          "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100",
          className ?? "",
        ].join(" ")}
      />
    );
  },

  table: (props) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
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
