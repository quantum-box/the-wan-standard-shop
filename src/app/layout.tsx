import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Wan Standard | Shop",
  description: "The Wan Standard — うちの子のためのセレクトショップ",
  openGraph: {
    siteName: "The Wan Standard",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
