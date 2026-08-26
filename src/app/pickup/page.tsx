import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "店舗受け取り・アクセス | THE WAN STANDARD",
  description: "バーナード・スクエアでのTHE WAN STANDARD商品受け取り方法とアクセスのご案内。",
};

const MAP_URL = "https://www.google.com/maps/search/?api=1&query=%E3%80%92005-0831+%E5%8C%97%E6%B5%B7%E9%81%93%E6%9C%AD%E5%B9%8C%E5%B8%82%E5%8D%97%E5%8C%BA%E4%B8%AD%E3%83%8E%E6%B2%A21%E4%B8%81%E7%9B%AE11-17";

export default function PickupPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-3">店舗受け取り・アクセス</h1>
        <p className="text-sm text-n1 leading-relaxed mb-10">ご注文の商品は、札幌市南区のバーナード・スクエアでお受け取りいただけます。</p>

        <section className="border border-s2/40 bg-white p-6 mb-8">
          <h2 className="font-serif-ja text-lg text-p2 mb-4">BERNARD SQUARE</h2>
          <dl className="grid grid-cols-[7rem_1fr] gap-y-3 text-sm">
            <dt className="text-n1">住所</dt><dd className="text-p2">〒005-0831 北海道札幌市南区中ノ沢1丁目11-17</dd>
            <dt className="text-n1">電話</dt><dd className="text-p2">011-578-5576</dd>
            <dt className="text-n1">営業時間</dt><dd className="text-p2">日・月・火 11:00–18:00 / 金・土 11:00–21:00</dd>
            <dt className="text-n1">定休日</dt><dd className="text-p2">水・木</dd>
            <dt className="text-n1">駐車場</dt><dd className="text-p2">14台</dd>
          </dl>
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-5 px-5 py-2.5 border border-p2 text-p2 text-sm hover:bg-p2 hover:text-p1 transition-colors">地図を開く</a>
        </section>

        <section className="space-y-7 text-sm text-n1 leading-relaxed">
          <div><h2 className="font-serif-ja text-lg text-p2 mb-2">受け取り方法</h2><p>店頭スタッフへTHE WAN STANDARDのオンライン注文であることをお伝えください。確認のため、注文番号とご注文時のお名前または電話番号をご提示いただく場合があります。</p></div>
          <div><h2 className="font-serif-ja text-lg text-p2 mb-2">受け取り期限</h2><p>原則として注文日から7日以内にお受け取りください。期限を過ぎる場合は、事前にお問い合わせください。</p></div>
          <div><h2 className="font-serif-ja text-lg text-p2 mb-2">休業日・臨時休業</h2><p>定休日および臨時休業日は商品をお渡しできません。最新の営業状況はバーナード・スクエアの案内をご確認のうえご来店ください。</p></div>
        </section>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link href="/shop/orders/lookup" className="text-p2 underline">注文を確認する</Link>
          <Link href="/guide" className="text-p2 underline">ショッピングガイド</Link>
          <Link href="/contact" className="text-p2 underline">お問い合わせ</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
