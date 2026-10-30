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
    <footer className="w-full border-t dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <Link href="/" className="flex items-center">
          <Image
            src="/icon/WUNAI.png"
            alt="WUNAI Logo"
            width={100}
            height={32}
            className="w-auto h-8 block dark:hidden"
          />
          <Image
            src="/icon/WUNAI-dark.png"
            alt="WUNAI Logo"
            width={100}
            height={32}
            className="w-auto h-8 hidden dark:block"
          />
        </Link>

        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          <CopyrightYear />
        </div>

        <div className="flex items-center space-x-6 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/about" className="transition-colors hover:text-blue-500 dark:hover:text-blue-400">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-blue-500 dark:hover:text-blue-400">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}