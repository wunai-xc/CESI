// src/app/layout.tsx
// 根布局：引入全局样式、导航栏、页脚和切页扫屏动画，并处理主题的首屏防闪白。
// 注意 styles 里只有 globals.css 一个入口，其余样式文件由它 @import 进来。

import type { Metadata } from "next";
import "./styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SweepLoader from "./components/SweepLoader";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site";

export const metadata: Metadata = {
  // metadataBase：把站内相对地址补成绝对地址（OG 图、canonical 等都需要）
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

// 内联到 <head> 的极小脚本：在首帧前根据 localStorage / 系统偏好给 <html> 加 .dark，
// 避免暗色用户看到一瞬白屏（ThemeToggle 里的逻辑与此保持一致）
const themeScript = `(()=>{try{const s=localStorage.getItem("theme");const d=s==="dark"||((s===null||s==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-cn" suppressHydrationWarning className="h-full antialiased">
      <head>
        {/* 站点字体预加载，避免首屏字体替换闪烁 */}
        <link
          rel="preload"
          href="/fonts/wsstubeddemo-m2ox5.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* 全屏扫屏动画：跟随路由变化播一遍 */}
        <SweepLoader />
        <Navbar />
        {/* min-h-svh 保证内容至少占满一屏，页脚被推到首屏之下，要下滑才看到 */}
        <main className="flex min-h-svh flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
