import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "武汉联合新生赛 · 个人报名",
  description: "武汉联合新生赛，ICPC 赛制个人赛报名。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
