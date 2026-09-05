import { PageShell } from "@/components/ui/PageShell";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "よくある質問 | THE WAN STANDARD",
  description: "THE WAN STANDARDのご注文、店舗受け取り、支払い、商品についてのよくある質問。",
};

const groups = [
  {
    title: "ご注文",
    items: [
      ["会員登録は必要ですか？", "現在は会員登録なしのゲスト購入でご注文いただけます。"],
      ["注文内容はどこで確認できますか？", "注文番号の下4桁とご注文時の電話番号を使って注文照会ページから確認できます。"],
    ],
  },
  {
    title: "店舗受け取り・お支払い",
    items: [
      ["商品はどこで受け取れますか？", "札幌市南区のバーナード・スクエアでお受け取りいただけます。"],
      ["支払いはいつ行いますか？", "商品受け取り時に店頭でお支払いください。オンライン上では決済されません。"],
      ["受け取り期限はありますか？", "原則として注文日から7日以内にお受け取りください。期限を過ぎる場合は事前にご相談ください。"],
    ],
  },
  {
    title: "商品・在庫",
    items: [
      ["SOLD OUTの商品は購入できますか？", "在庫切れの商品はカートへ追加できません。再入荷については商品ページの案内をご確認ください。"],
      ["どのサイズを選べばよいですか？", "商品ページの寸法と、サイズ・商品の選び方ページの目安をご確認ください。"],
    ],
  },
  {
    title: "キャンセル・返品",
    items: [
      ["注文をキャンセルできますか？", "受け取り前であれば、商品の準備状況に応じて対応できる場合があります。注文番号を添えてお問い合わせください。"],
      ["受け取り後に返品できますか？", "お客様都合の返品・交換は原則として承っていません。不良品・破損・商品違いはお問い合わせください。"],
    ],
  },
] as const;

export default function FaqPage() {
  return (
    <PageShell>
        <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-3">よくある質問</h1>
        <p className="text-sm text-n1 mb-10">購入前後によくいただく質問をまとめています。</p>

        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.title}>
              <h2 className="font-serif-ja text-lg text-p2 mb-3">{group.title}</h2>
              <div className="border-t border-s2/40">
                {group.items.map(([question, answer]) => (
                  <details key={question} className="group border-b border-s2/40 py-4">
                    <summary className="cursor-pointer list-none flex justify-between gap-4 text-sm font-medium text-p2">
                      <span>{question}</span><span aria-hidden="true" className="text-s1 group-open:rotate-45 transition-transform">＋</span>
                    </summary>
                    <p className="pt-3 pr-8 text-sm text-n1 leading-relaxed">{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 border border-s2/40 bg-white p-6">
          <h2 className="font-serif-ja text-lg text-p2 mb-2">解決しない場合</h2>
          <p className="text-sm text-n1 mb-4">注文についてのお問い合わせは、注文番号を添えてご連絡ください。</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/contact" className="text-p2 underline">お問い合わせ</Link>
            <Link href="/guide" className="text-p2 underline">ショッピングガイド</Link>
            <Link href="/shop/orders/lookup" className="text-p2 underline">注文を確認する</Link>
          </div>
        </div>
      </PageShell>
  );
}
