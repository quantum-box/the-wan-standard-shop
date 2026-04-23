import type { Metadata } from "next";
import { ShopProductGrid } from "./ShopProductGrid";

export const metadata: Metadata = {
  title: "Shop | THE WAN STANDARD",
  description:
    "THE WAN STANDARD公式オンラインストア。職人の手による、愛犬のための一椀をお届けします。",
  openGraph: {
    title: "Shop | THE WAN STANDARD",
    description:
      "THE WAN STANDARD公式オンラインストア。職人の手による、愛犬のための一椀をお届けします。",
    url: "/shop",
    images: [
      {
        url: "/assets/og/tws-og-shop.jpg",
        width: 1408,
        height: 768,
        alt: "THE WAN STANDARD Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop | THE WAN STANDARD",
    description:
      "THE WAN STANDARD公式オンラインストア。職人の手による、愛犬のための一椀をお届けします。",
    images: ["/assets/og/tws-og-shop.jpg"],
  },
};

export default function ShopPage() {
  return (
    <div>
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-8">
        Shop
      </h1>
      <ShopProductGrid />
    </div>
  );
}
