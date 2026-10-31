"use client";

import { usePathname } from "next/navigation";

export default function SweepLoader() {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      <span className="sweep-bar-v absolute left-0 top-0 h-full w-[10px] bg-black dark:bg-white" />
      <span className="sweep-bar-h absolute bottom-0 left-0 h-[10px] w-full bg-black dark:bg-white" />
    </div>
  );
}
