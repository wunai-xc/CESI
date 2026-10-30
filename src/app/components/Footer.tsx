"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

function CopyrightYear() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return <span>© {year} WUNAI. All rights reserved.</span>;
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-3 divide-x divide-zinc-200 px-2 dark:divide-zinc-800 sm:px-4">
        <div className="flex items-center justify-center px-1 py-6 sm:px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/icon/WUNAI.png"
              alt="WUNAI Logo"
              width={100}
              height={32}
              className="h-6 w-auto max-w-full block sm:h-8 dark:hidden"
            />
            <Image
              src="/icon/WUNAI-dark.png"
              alt="WUNAI Logo"
              width={100}
              height={32}
              className="h-6 w-auto max-w-full hidden sm:h-8 dark:block"
            />
          </Link>
        </div>

        <div className="flex items-center justify-center px-1 py-6 text-center text-xs text-zinc-500 sm:px-6 sm:text-sm dark:text-zinc-400">
          <CopyrightYear />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-1 py-6 text-xs text-zinc-500 sm:gap-x-6 sm:px-6 sm:text-sm dark:text-zinc-400">
          <Link
            href="/about"
            className="whitespace-nowrap transition-colors hover:text-blue-500 dark:hover:text-blue-400"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="whitespace-nowrap transition-colors hover:text-blue-500 dark:hover:text-blue-400"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
