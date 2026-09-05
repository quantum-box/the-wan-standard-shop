import { PageShell } from "@/components/ui/PageShell";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ショッピングガイド | THE WAN STANDARD",
  description: "THE WAN STANDARDでのご注文から店舗受け取りまでのご利用ガイド。",
};

const steps = [
  ["1", "商品を選ぶ", "商品ページでサイズや在庫をご確認のうえ、商品をカートに追加してください。"],
  ["2", "注文情報を入力", "カートからチェックアウトへ進み、お名前・電話番号・必要に応じてメールアドレスを入力します。"],
  ["3", "注文内容を確認", "商品、数量、受け取り方法、連絡先を確認して注文を確定します。"],
  ["4", "店舗で受け取る", "バーナードスクエアで商品をお受け取りください。お支払いは店頭で行います。"],
] as const;

export default function GuidePage() {
  return (
    <PageShell>
        <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-3">ショッピングガイド</h1>
        <p className="text-sm text-n1 leading-relaxed mb-10">
          THE WAN STANDARDは現在、ゲスト購入・店舗受け取りを中心にご利用いただけます。
        </p>

        <section className="mb-12">
          <h2 className="font-serif-ja text-lg text-p2 mb-5">ご注文から受け取りまで</h2>
          <ol className="space-y-4">
            {steps.map(([number, title, body]) => (
              <li key={number} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-s2/30 pb-4">
                <span className="font-serif-en text-xl text-s1">{number}</span>
                <div>
                  <h3 className="text-sm font-medium text-p2 mb-1">{title}</h3>
                  <p className="text-sm text-n1 leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid sm:grid-cols-2 gap-4 mb-12">
          <div className="border border-s2/40 bg-white p-5">
            <h2 className="text-sm font-medium text-p2 mb-2">お支払い</h2>
            <p className="text-sm text-n1 leading-relaxed">商品受け取り時に店舗でお支払いください。オンライン上では決済されません。</p>
          </div>
          <div className="border border-s2/40 bg-white p-5">
            <h2 className="text-sm font-medium text-p2 mb-2">受け取り場所・時間</h2>
            <p className="text-sm text-n1 leading-relaxed mb-2">受け取り場所はバーナードスクエアです。営業日・アクセスは受け取り案内をご確認ください。</p>
            <Link href="/pickup" className="text-sm text-p2 underline">店舗受け取り案内</Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-serif-ja text-lg text-p2 mb-4">注文後の確認</h2>
          <p className="text-sm text-n1 leading-relaxed mb-3">注文番号とご注文時の電話番号で、注文状況を確認できます。</p>
          <Link href="/shop/orders/lookup" className="inline-block px-5 py-2.5 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3">注文を確認する</Link>
        </section>

        <section className="border-t border-s2/40 pt-8">
          <h2 className="font-serif-ja text-lg text-p2 mb-4">お困りの場合</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link href="/guide/cancel" className="text-p2 underline">返品・キャンセルについて</Link>
            <Link href="/faq" className="text-p2 underline">よくある質問</Link>
            <Link href="/contact" className="text-p2 underline">お問い合わせ</Link>
          </div>
        </section>
      </PageShell>
  );
}
