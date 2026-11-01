// src/app/content/links/page.tsx
// 友链页面（路由 /content/links）。列表数据直接写在下面 FRIENDS 里，
// 头像用对方站点的图片地址，因此用原生 <img> 而不是 next/image
// （静态导出下 next/image 不做远程优化，原生 img 更简单直接）。

/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import BackHome from "@/app/components/button/BackHome";


export const metadata: Metadata = {
  title: "FriendLinks 友链",
  description: "WUNAI 的友链：一些朋友或组织的网站。",
};

type FriendLink = {
  name: string;
  url: string;
  // 头像地址；对方站点没提供时用 GitHub 头像端点
  avatar: string;
  note: string;
};

const FRIENDS: FriendLink[] = [
  {
    name: "hconzlvra",
    url: "https://hconzlvra.top/",
    avatar: "https://avatars.githubusercontent.com/u/273501356?v=4&s=96",
    note: "就让我自己登基，成为疯的君王.",
  },
  {
    name: "molforte",
    url: "https://molforte.github.io/Molforte.pages/",
    avatar: "https://avatars.githubusercontent.com/u/176408050?v=4&s=96",
    note: "来自中国浙江省的学生，正在学习嵌入式与 AI。",
  },
  {
    name: "arcadia",
    url: "https://www.arcadia.moe/",
    avatar: "https://avatars.githubusercontent.com/u/97033226?v=4&s=96",
    note: "开发者",
  },
  {
    name: "bfladderbean",
    url: "https://www.bfladderbean.me/",
    avatar: "https://avatars.githubusercontent.com/u/139599235?v=4&s=96",
    note: "立春天，风渐暖，伊人一去不复返",
  },
  {
    name: "subear",
    url: "https://subear.net/",
    // 该站首页未声明 favicon，用它自己的站内头像图
    avatar: "https://subear.net/src/ProfilePhoto.jpg",
    note: "Seeing · Living · Sleeping",
  },
  {
    name: "GTMC",
    url: "https://www.techmc.wiki/",
    // 该站 /favicon.ico 是有效图标文件（ICO 内嵌 PNG）
    avatar: "https://www.techmc.wiki/favicon.ico",
    note: "Graduate Texts in Minecraft：社区编写的技术性 MC 开放教科书，涵盖红石、游戏机制与引擎内部原理",
  },
  {
    name: "RSEGordon Blog",
    url: "https://clawblog.rseg.club/",
    // GitHub 官方头像端点：github.com/<用户名>.png 会 302 到 avatars.githubusercontent.com
    avatar: "https://github.com/RSEGordon.png?size=96",
    note: "海洋遥感 · 数据科学 · 日常折腾",
  },
  {
    name: "Ryan100c",
    url: "https://hotpad100c-github-io.pages.dev/",
    avatar: "https://github.com/hotpad100c.png?size=96",
    note: "编程 · Minecraft · 创造：记录开发日志、灵感与 Minecraft 技术研究",
  },
  {
    name: "Linvin",
    url: "https://blog.linvin.net/",
    avatar: "https://github.com/Linvin-1233.png?size=96",
    note: "一位 MC 玩家，对储电稍有研究。对全栈、Web 开发也稍有钻研。",
  },
];

// 从完整 URL 里取出域名，作为卡片底部的小字
function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function FriendLinks() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">

      <BackHome />

      <header className="mt-6 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
          03 / links
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          FriendLinks 友链
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          共 {FRIENDS.length} 个 · 网站
        </p>
      </header>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {FRIENDS.map((friend) => (
          <li key={friend.url}>
            <a
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-start gap-3 border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <img
                src={friend.avatar}
                alt=""
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-12 w-12 shrink-0 border border-zinc-200 object-cover dark:border-zinc-800"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-zinc-900 transition-colors group-hover:text-accent dark:text-zinc-100">
                  {friend.name}
                </span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {friend.note}
                </span>
                <span className="mt-1.5 block truncate font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-600">
                  {hostOf(friend.url)}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-10 border-t border-zinc-200 pt-6 text-xs leading-6 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        想交换友链？把你的站名、地址、头像和一句简介发我邮件即可，看到就会加上。
      </p>
    </div>
  );
}
