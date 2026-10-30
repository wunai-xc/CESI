import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import BrandIcon from "./BrandIcon";
import ThemeToggle from "./ThemeToggle";
import type { BrandName } from "./brand-icons";

type SiteLink = { name: string; icon: BrandName; href: string };
type SiteGroup = { title: string; items: SiteLink[] };
type ProfileLink = { label: string; icon: BrandName; value: string };
type LegalLink = { label: string; href: string };

const siteGroups: SiteGroup[] = [
  {
    title: "代码 / 社交",
    items: [
      { name: "GitHub", icon: "github", href: "https://github.com" },
      { name: "X", icon: "x", href: "https://x.com" },
    ],
  },
  {
    title: "视频",
    items: [
      { name: "哔哩哔哩", icon: "bilibili", href: "https://www.bilibili.com" },
      { name: "YouTube", icon: "youtube", href: "https://www.youtube.com" },
    ],
  },
  {
    title: "联系",
    items: [
      { name: "Discord", icon: "discord", href: "https://discord.com" },
      { name: "QQ", icon: "qq", href: "https://im.qq.com" },
      { name: "微信", icon: "wechat", href: "https://weixin.qq.com" },
    ],
  },
  {
    title: "AI",
    items: [
      { name: "DeepSeek", icon: "deepseek", href: "https://www.deepseek.com" },
      { name: "Trae", icon: "trae", href: "https://www.trae.ai" },
    ],
  },
];

const profileLinks: ProfileLink[] = [
  { label: "GitHub", icon: "github", value: "" },
  { label: "哔哩哔哩", icon: "bilibili", value: "" },
  { label: "Discord", icon: "discord", value: "" },
  { label: "QQ", icon: "qq", value: "" },
  { label: "Email", icon: "gmail", value: "" },
];

const legalLinks: LegalLink[] = [
  { label: "服务条款", href: "/terms" },
  { label: "隐私政策", href: "/privacy" },
];

async function CopyrightYear() {
  await connection();

  return (
    <span>© {new Date().getFullYear()} WUNAI. All rights reserved.</span>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/icon/WUNAI.png"
              alt="WUNAI Logo"
              width={120}
              height={40}
              className="h-8 w-auto block dark:hidden"
            />
            <Image
              src="/icon/WUNAI-dark.png"
              alt="WUNAI Logo"
              width={120}
              height={40}
              className="h-8 w-auto hidden dark:block"
            />
          </Link>

          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 divide-y divide-zinc-200 dark:divide-zinc-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="py-6 sm:pr-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              常用网站
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {siteGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {group.title}
                  </p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item.name}
                          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                        >
                          <BrandIcon name={item.icon} className="h-3.5 w-3.5" />
                          <span>{item.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="py-6 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              关于我
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {profileLinks.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  <BrandIcon
                    name={item.icon}
                    className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500"
                  />
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {item.label}
                  </span>
                  {item.value ? (
                    <span className="truncate text-zinc-700 dark:text-zinc-200">
                      {item.value}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="py-6 sm:pl-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              条款 / 协议
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-zinc-200 py-4 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <Suspense fallback={<span>© WUNAI. All rights reserved.</span>}>
              <CopyrightYear />
            </Suspense>
          </p>
          <button
            type="button"
            title="设置"
            aria-label="设置"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            <SettingsIcon />
            <span>设置</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
