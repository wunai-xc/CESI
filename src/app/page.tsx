import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <h1 className="text-center text-5xl">Hello! This is my App.</h1>
      <Link
        href="/posts"
        className="px-5 py-2 text-sm transition-colors hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400"
      >
        All Posts →
      </Link>
    </div>
  );
}
