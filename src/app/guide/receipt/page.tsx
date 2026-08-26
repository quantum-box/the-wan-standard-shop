import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = { title: "領収書・支払い証明 | THE WAN STANDARD", description: "店舗受け取り注文の領収書・支払い証明に関するご案内。" };

export default function ReceiptGuidePage() {
  return <><Header /><main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
    <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-3">領収書・支払い証明</h1>
    <p className="text-sm text-n1 leading-relaxed mb-10">THE WAN STANDARDの現在のご注文は店舗受け取り・店頭払いです。領収書は実際にお支払いいただく店舗でお受け取りください。</p>
    <div className="space-y-8 text-sm text-n1 leading-relaxed">
      <section><h2 className="font-serif-ja text-lg text-p2 mb-3">発行方法</h2><p>商品受け取り時のお会計の際に、スタッフへ領収書が必要であることをお伝えください。オンライン注文完了画面は注文控えであり、支払い済みの領収書ではありません。</p></section>
      <section><h2 className="font-serif-ja text-lg text-p2 mb-3">宛名・但書</h2><p>指定がある場合は、お会計前にスタッフへ希望する宛名・但書をお伝えください。店舗の会計システムで対応可能な範囲で発行します。</p></section>
      <section><h2 className="font-serif-ja text-lg text-p2 mb-3">再発行</h2><p>紛失等による再発行が必要な場合は、注文番号、購入日、お支払い時のお名前を用意してお問い合わせください。支払い記録を確認したうえで対応可否をご案内します。</p></section>
    </div>
    <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link href="/shop/orders/lookup" className="text-p2 underline">注文を確認する</Link><Link href="/contact" className="text-p2 underline">お問い合わせ</Link><Link href="/guide" className="text-p2 underline">ショッピングガイド</Link></div>
  </main><Footer /></>;
}
