import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE WAN STANDARD | 愛犬のための、新しい基準。",
  description:
    "日本の工芸・陶器の美意識を体現したプレミアム犬用食器ブランド。食品衛生法基準に適合した、職人の手による一椀をあなたの愛犬へ。",
  openGraph: {
    siteName: "THE WAN STANDARD",
    locale: "ja_JP",
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
