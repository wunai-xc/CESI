// src/app/components/Footer.tsx
// 页脚：最上一行是站点 logo + 主题三切按钮（无分隔线），
// 下面三栏用竖线分隔：常用网站 / 关于我（联系方式）/ 条款与隐私，
// 最下一行是版权年份（Suspense 里动态取）和占位的设置按钮。

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import BrandIcon from "./BrandIcon";
import ThemeToggle from "./ThemeToggle";
import type { BrandName } from "./brand-icons";

type SiteLink = { name: string; icon: BrandName; href: string };
type SiteGroup = { title: string; items: SiteLink[] };
type ProfileLink = { label: string; icon: BrandName; href: string };
type LegalLink = { label: string; href: string };

// 第一栏常用网站
const siteGroups: SiteGroup[] = [
  {
    title: "code / social contact",
    items: [
      { name: "GitHub", icon: "github", href: "https://github.com" },
      { name: "X", icon: "x", href: "https://x.com" },
    ],
  },
  {
    title: "video",
    items: [
      { name: "BiliBili", icon: "bilibili", href: "https://www.bilibili.com" },
      { name: "YouTube", icon: "youtube", href: "https://www.youtube.com" },
    ],
  },
  {
    title: "contact",
    items: [
      { name: "Discord", icon: "discord", href: "https://discord.com" },
      { name: "QQ", icon: "qq", href: "https://im.qq.com" },
      { name: "WeChat", icon: "wechat", href: "https://weixin.qq.com" },
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

// 第二栏关于我以及联系
const profileLinks: ProfileLink[] = [
  { label: "GitHub", icon: "github", href: "https://github.com/wunai-xc" },
  { label: "BiliBili", icon: "bilibili", href: "https://b23.tv/GX3txwm" },
  { label: "Discord", icon: "discord", href: "https://discord.gg/NDyVRZzH" },
  { label: "QQ", icon: "qq", href: "https://qm.qq.com/q/lbaW6DOHdK" },
  { label: "Email", icon: "gmail", href: "3234319738@qq.com" },
];

// 第三栏条款与隐私
const legalLinks: LegalLink[] = [
  { label: "服务条款 terms", href: "/content/terms" },
  { label: "隐私政策 privacy", href: "/content/privacy" },
];

// 邮箱这类没写协议的地址自动补 mailto:，其余原样返回
function profileHref(href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:")) return href;
  return href.includes("@") ? `mailto:${href}` : href;
}

// 版权年份：先 await connection() 表示"这里依赖请求时信息"，
// 否则 cacheComponents 会因为在预渲染阶段读 new Date() 而报错
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
        {/* 顶行：logo + 主题切换，这一行没有分隔线 */}
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

        {/* 三栏：窄屏上下堆叠（横线分隔），sm 起并排（竖线分隔） */}
        <div className="grid grid-cols-1 divide-y divide-zinc-200 dark:divide-zinc-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="py-6 sm:pr-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Commonly used websites
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
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-600 transition-colors hover:border-blue-400 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
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
              About me.
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {profileLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={profileHref(item.href)}
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
                  >
                    <BrandIcon name={item.icon} className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="py-6 sm:pl-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              terms / privacy
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

        {/* 底行：版权 + 设置按钮（占位，暂无功能） */}
        <div className="flex items-center justify-between gap-4 border-t border-zinc-200 py-4 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <Suspense fallback={<span>© WUNAI. All rights reserved.</span>}>
              <CopyrightYear />
            </Suspense>
          </p>
          <button
            type="button"
            title="Settings 设置"
            aria-label="Settings"
            className="inline-flex items-center gap-1.5 border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          >
            <SettingsIcon />
            <span>Settings</span>
            <span className="text-zinc-400 dark:text-zinc-500">设置</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
