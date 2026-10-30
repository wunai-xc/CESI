import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="bg-white dark:text-zinc-100 shadow-md border-b dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-3xl font-bold dark:text-white transition-colors hover:text-blue-300 flex items-center">
          <Image
            src="/icon/WUNAI.png"
            alt="WUNAI Logo"
            width={120}
            height={40}
            className="w-auto h-8 block dark:hidden"
          />
          <Image
            src="/icon/WUNAI-dark.png"
            alt="WUNAI Logo"
            width={120}
            height={40}
            className="w-auto h-8 hidden dark:block"
          />
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/posts" className="transition-colors hover:text-blue-400">
            All posts
          </Link>
          <Link href="/about" className="transition-colors hover:text-blue-400">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-blue-400">
            Contact
          </Link>
          <Link href="/links" className="transition-colors hover:text-blue-400">
            Links
          </Link>
        </div>
      </nav>
    </header>
  );
}