import type { Metadata } from "next";
import "./styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: {
    default: "cesi",
    template: "%s | cesi",
  },
  description: "WUNAI 的个人站点",
};

const themeScript = `(()=>{try{const s=localStorage.getItem("theme");const d=s==="dark"||((s===null||s==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-cn" suppressHydrationWarning className="h-full antialiased">
      <head>
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
