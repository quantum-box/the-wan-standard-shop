import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = { title: "ご注文について | THE WAN STANDARD", robots: { index: false, follow: false } };

export default function MyOrdersPage() {
  return <><Header /><main className="flex-grow max-w-xl w-full mx-auto px-4 sm:px-6 py-16">
    <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-2">Order Inquiry</h1>
    <p className="font-serif-ja text-sm text-n1 mb-10">ご注文について</p>
    <section className="border border-s2/40 bg-white p-6 mb-8">
      <h2 className="font-serif-ja text-base text-p2 mb-3">注文内容の確認</h2>
      <p className="text-sm text-n1 leading-relaxed mb-4">ご注文番号と電話番号で、注文状況をご確認いただけます。</p>
      <Link href="/shop/orders/lookup" className="inline-block px-6 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors">注文を確認する</Link>
    </section>
    <section className="border border-s2/40 bg-white p-6 mb-8">
      <h2 className="font-serif-ja text-base text-p2 mb-3">お問い合わせ</h2>
      <p className="text-sm text-n1 leading-relaxed mb-4">注文内容の変更・受け取りに関するご相談は、注文番号をご用意のうえお問い合わせください。</p>
      <Link href="/contact" className="inline-block px-6 py-3 border border-p2 text-p2 text-sm hover:bg-p2 hover:text-p1 transition-colors">お問い合わせ方法を見る</Link>
    </section>
    <Link href="/shop" className="text-sm text-n1 hover:text-p2 transition-colors">← ショップに戻る</Link>
  </main><Footer /></>;
}
