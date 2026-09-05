import type { Metadata } from "next";
import { ShopProductGrid } from "./ShopProductGrid";
import Link from "next/link";
import styles from "@/components/ui/storefront.module.css";

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
      <section className={styles.catalogIntro} aria-labelledby="shop-title">
        <div><p className={styles.eyebrow} lang="en">THE COLLECTION</p><h1 id="shop-title">その子の毎日に、<br />ちょうどいい一椀を。</h1></div>
        <div><p>食べ方も、からだの大きさも、それぞれ。<br />一緒に暮らす日々を思い浮かべながら、お選びください。</p><div className={styles.catalogLinks}><Link href="/guide/size" className={styles.textLink}>サイズ・商品の選び方</Link><Link href="/guide/gift" className={styles.textLink}>贈りものを選ぶ</Link></div></div>
      </section>
      <ShopProductGrid />
    </div>
  );
}
