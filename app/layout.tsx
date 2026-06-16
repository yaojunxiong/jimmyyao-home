import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jimmyyao.com"),
  title: "Jimmy Yao｜AI・学習・デジタルライフ",
  description:
    "Jimmy Yao の個人サイト。AIツール、学習システム、日本語学習、日本生活、デジタルライフの記録と探索。Personal website about AI tools, learning systems, Japanese learning and digital life.",
  keywords: [
    "Jimmy Yao",
    "jimmyyao",
    "JimmyYao",
    "ジミー・ヤオ",
    "个人网站",
    "个人主页",
    "個人サイト",
    "個人ホームページ",
    "personal website",
    "personal homepage",
    "AI工具",
    "AIツール",
    "AI tools",
    "AI学习",
    "AI learning",
    "学习系统",
    "学習システム",
    "learning system",
    "日语学习",
    "日本語学習",
    "Japanese learning",
    "日本生活",
    "Japan life",
    "数字生活",
    "デジタルライフ",
    "digital life"
  ],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: "Jimmy Yao｜AI・学習・デジタルライフ",
    description:
      "AIツール、学習システム、日本語学習、日本生活、デジタルライフの記録と探索。Personal website about AI tools, learning systems, Japanese learning and digital life.",
    url: "https://www.jimmyyao.com",
    siteName: "jimmyyao.com",
    type: "website",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Jimmy Yao JY Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Jimmy Yao｜AI・学習・デジタルライフ",
    description: "AIツール、学習システム、日本語学習、日本生活、デジタルライフの記録と探索。",
    images: ["/android-chrome-512x512.png"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#050306"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="canonical" href="https://www.jimmyyao.com/" />
      </head>
      <body>{children}</body>
    </html>
  );
}
