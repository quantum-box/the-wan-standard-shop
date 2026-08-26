import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | THE WAN STANDARD",
  description: "THE WAN STANDARDの特定商取引法に基づく表記。",
  robots: { index: true, follow: true },
};

const rows = [
  ["販売業者", "Quantum Box 株式会社"],
  ["運営責任者", "福山 貴徳"],
  ["所在地", "〒150-0043 東京都渋谷区道玄坂1丁目10番8号"],
  ["電話番号", "ご請求があった場合、遅滞なく開示いたします。"],
  ["お問い合わせ", "info@quantum-box.com"],
  ["販売価格", "各商品ページに税込価格で表示します。"],
  ["商品代金以外の必要料金", "店舗受け取りの場合、送料はかかりません。通信費等はお客様のご負担となります。"],
  ["支払方法・支払時期", "店舗での商品受け取り時にお支払いください。利用可能な支払方法は受け取り店舗の案内に従います。"],
  ["商品の引渡時期", "ご注文後、受け取り準備が整い次第ご案内します。原則として注文日から7日以内にお受け取りください。"],
  ["返品・キャンセル", "受け取り前のキャンセル、受け取り後の返品・交換、不良品への対応は返品・キャンセルポリシーをご確認ください。"],
  ["販売数量等の条件", "在庫数に限りがあります。商品ごとの購入可能数は商品ページまたはカート上の表示を優先します。"],
] as const;

export default function CommercialTransactionsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-2">
          特定商取引法に基づく表記
        </h1>
        <p className="text-xs text-n1 mb-8">最終更新: 2026年8月26日</p>

        <dl className="border-t border-s2/40">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-2 sm:gap-6 py-5 border-b border-s2/40"
            >
              <dt className="text-sm font-medium text-p2">{label}</dt>
              <dd className="text-sm text-n1 leading-relaxed">
                {label === "お問い合わせ" ? (
                  <a href={`mailto:${value}`} className="underline hover:text-p2">
                    {value}
                  </a>
                ) : label === "返品・キャンセル" ? (
                  <>
                    {value}{" "}
                    <a href="/guide/cancel" className="underline hover:text-p2">
                      詳細を見る
                    </a>
                  </>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </main>
      <Footer />
    </>
  );
}
