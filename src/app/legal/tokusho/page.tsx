import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | THE WAN STANDARD",
  description:
    "THE WAN STANDARD（運営: Quantum Box株式会社）の特定商取引法に基づく表記。",
  robots: { index: true, follow: true },
};

type Row = { label: string; value: React.ReactNode };

const rows: Row[] = [
  { label: "販売業者", value: "Quantum Box 株式会社" },
  { label: "代表者", value: "福山 貴徳" },
  {
    label: "所在地",
    value: (
      <>
        〒150-0043 東京都渋谷区道玄坂1丁目10番8号
        <br />
        （札幌支社: 〒005-0831 北海道札幌市南区中ノ沢1丁目11-17）
      </>
    ),
  },
  {
    label: "お問い合わせ",
    value: (
      <>
        メール: <a href="mailto:info@quantum-box.com" className="underline">info@quantum-box.com</a>
        <br />
        （電話番号は、ご請求があれば遅滞なく開示いたします）
      </>
    ),
  },
  {
    label: "販売価格",
    value: "各商品ページに表示する価格（消費税込み）",
  },
  {
    label: "商品代金以外の必要料金",
    value: (
      <>
        送料: 全国一律 880円（税込、沖縄・離島は別途見積り）
        <br />
        決済手数料: 当社負担（ただし代金引換をご利用の場合は別途手数料が発生する場合があります）
      </>
    ),
  },
  {
    label: "お支払方法",
    value: "クレジットカード（Visa / Mastercard / JCB / American Express）、その他各商品ページに記載の決済方法",
  },
  {
    label: "お支払時期",
    value: "クレジットカード: ご注文確定時にご決済",
  },
  {
    label: "商品の引渡時期",
    value:
      "ご注文確定後、通常3〜7営業日以内に発送いたします。受注生産品・予約販売品については、各商品ページに記載の発送時期をご確認ください。",
  },
  {
    label: "返品・交換について",
    value: (
      <>
        <strong className="block mb-1">お客様都合による返品・交換</strong>
        商品の性質上、原則としてお客様都合による返品・交換はお受けしておりません。
        <br />
        <br />
        <strong className="block mb-1">不良品・誤送による返品・交換</strong>
        商品到着後7日以内に <a href="mailto:info@quantum-box.com" className="underline">info@quantum-box.com</a> までご連絡ください。
        当社送料負担にて、良品との交換または返金対応をいたします。
      </>
    ),
  },
  {
    label: "販売数量の制限",
    value: "商品ごとに購入可能数量を制限する場合があります。詳細は各商品ページをご確認ください。",
  },
  {
    label: "動作環境",
    value:
      "当サイトは主要モダンブラウザ（最新版の Chrome / Safari / Firefox / Edge）での閲覧を推奨します。",
  },
];

export default function TokushoPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-2">
          特定商取引法に基づく表記
        </h1>
        <p className="text-xs text-n1 mb-8">最終更新: 2026年4月22日</p>

        <dl className="divide-y divide-s2/30">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 py-4"
            >
              <dt className="font-serif-ja text-sm text-p2 font-semibold">
                {row.label}
              </dt>
              <dd className="text-sm text-n1 leading-relaxed">{row.value}</dd>
            </div>
          ))}
        </dl>
      </main>
      <Footer />
    </>
  );
}
