// src/app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        隐私政策
      </h1>

      <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
        <p>
          这个博客不收集、不存储你的任何个人信息，也没有账号系统。
        </p>
        <p>
          唯一保存在你浏览器里的是<strong>主题偏好</strong>（亮色 / 暗色），它存在
          localStorage 里，不会发送到服务器。
        </p>
        <p>
          目前站内没有接入统计、广告或第三方追踪脚本。以后如果加了，会在这里说明。
        </p>
        <p className="text-zinc-400">
          最后更新：2025-10
        </p>
      </div>
    </div>
  );
}
