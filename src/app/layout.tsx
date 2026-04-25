import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = "https://thewanstandard.jp";
const defaultOgImage = `${siteUrl}/assets/og/tws-og-default.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "THE WAN STANDARD | 愛犬のための、新しい基準。",
  description:
    "日本の工芸・陶器の美意識を体現したプレミアム犬用食器ブランド。食品衛生法基準に適合した、職人の手による一椀をあなたの愛犬へ。",
  openGraph: {
    siteName: "THE WAN STANDARD",
    locale: "ja_JP",
    type: "website",
    url: siteUrl,
    title: "THE WAN STANDARD | 愛犬のための、新しい基準。",
    description:
      "日本の工芸・陶器の美意識を体現したプレミアム犬用食器ブランド。食品衛生法基準に適合した、職人の手による一椀をあなたの愛犬へ。",
    images: [
      {
        url: defaultOgImage,
        width: 1296,
        height: 864,
        alt: "THE WAN STANDARD — 愛犬のための、新しい基準。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THE WAN STANDARD | 愛犬のための、新しい基準。",
    description:
      "日本の工芸・陶器の美意識を体現したプレミアム犬用食器ブランド。",
    images: [defaultOgImage],
  },
};

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaMeasurementId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
