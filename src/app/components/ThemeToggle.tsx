// src/app/components/ThemeToggle.tsx
// 亮色 / 暗色 / 跟随系统 三切按钮。
// 主题存在 localStorage 的 "theme"，实际效果是在 <html> 上加/去 .dark 类；
// 首屏防闪白的脚本在 src/app/layout.tsx 的 <head> 里。

"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

// 极简外部 store：所有按钮 + 系统主题变化都通过它通知 React 重渲染
const listeners = new Set<() => void>();

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// 把主题落到 DOM 上：class 决定 Tailwind 的 dark: 变体，colorScheme 决定浏览器原生控件配色
function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" || (theme === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

// 读取已保存的主题，没存过就是"跟随系统"
function readTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

// useSyncExternalStore 的订阅：系统主题变化、别的标签页改主题时同步过来
function subscribe(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    applyTheme(readTheme());
    listeners.forEach((fn) => fn());
  };

  media.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

// 用户点击后：写 localStorage、立即应用到 DOM、通知所有订阅者
function setTheme(theme: Theme) {
  window.localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
  listeners.forEach((fn) => fn());
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
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
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function SystemIcon() {
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
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8m-4-4v4" />
    </svg>
  );
}

// 三个选项：值、可访问标签、图标
const options: { value: Theme; label: string; icon: () => React.JSX.Element }[] =
  [
    { value: "light", label: "Light 亮色", icon: SunIcon },
    { value: "dark", label: "Dark 暗色", icon: MoonIcon },
    { value: "system", label: "System 跟随系统", icon: SystemIcon },
  ];

export default function ThemeToggle() {
  // 服务端渲染时固定给 "system"，水合后立刻换成真实值，避免 SSR/客户端不一致
  const theme = useSyncExternalStore(
    subscribe,
    readTheme,
    () => "system" as Theme,
  );

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={[
              "p-1.5 transition-colors",
              active
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200",
            ].join(" ")}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
