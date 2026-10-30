import type { ReactNode } from "react";

type CalloutType = "info" | "warn" | "danger";

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children?: ReactNode;
};

const styles: Record<CalloutType, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100",
  warn: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100",
  danger:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100",
};

export default function Callout({
  type = "info",
  title,
  children,
}: CalloutProps) {
  return (
    <aside className={`not-prose my-6 rounded-xl border px-4 py-3 text-sm leading-6 ${styles[type]}`}>
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div className="[&>*+*]:mt-2 [&_p]:m-0">{children}</div>
    </aside>
  );
}
