import { PageShell } from "@/components/ui/PageShell";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "返品・キャンセルポリシー | THE WAN STANDARD",
  description: "THE WAN STANDARDの店舗受け取り注文に関するキャンセル・返品のご案内。",
};

export default function CancelPolicyPage() {
  return (
    <PageShell>
        <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-3">返品・キャンセルポリシー</h1>
        <p className="text-sm text-n1 leading-relaxed mb-10">
          店舗受け取り・店頭払いのご注文について、キャンセルや返品が必要になった場合の基本的な取り扱いをご案内します。
        </p>

        <div className="space-y-9 text-sm text-n1 leading-relaxed">
          <section>
            <h2 className="font-serif-ja text-lg text-p2 mb-3">注文後〜受け取り前のキャンセル</h2>
            <p className="mb-3">受け取り前のキャンセルをご希望の場合は、注文番号を添えてお問い合わせください。商品の準備状況によってはキャンセルを承れない場合があります。</p>
            <Link href="/contact" className="text-p2 underline">お問い合わせ方法を見る</Link>
          </section>

          <section>
            <h2 className="font-serif-ja text-lg text-p2 mb-3">受け取り期限を過ぎた場合</h2>
            <p>原則として注文日から7日以内にお受け取りください。期限を過ぎた注文は、在庫確保を解除するため自動的にキャンセルされる場合があります。</p>
          </section>

          <section>
            <h2 className="font-serif-ja text-lg text-p2 mb-3">受け取り後の返品・交換</h2>
            <p>商品の性質上、お客様都合による受け取り後の返品・交換は原則として承っていません。サイズや仕様はご注文前に商品ページで十分にご確認ください。</p>
          </section>

          <section>
            <h2 className="font-serif-ja text-lg text-p2 mb-3">不良品・破損・商品違い</h2>
            <p>商品に初期不良や破損がある場合、またはご注文と異なる商品をお渡しした場合は、商品を使用せず速やかにお問い合わせください。状態を確認のうえ、交換または返品について個別にご案内します。</p>
          </section>

          <section>
            <h2 className="font-serif-ja text-lg text-p2 mb-3">返金について</h2>
            <p>店頭でのお支払い後に返金が必要となった場合は、実際のお支払い方法および店舗の処理方法に応じて返金します。返金方法・反映時期は受付時にご案内します。</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-s2/40 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link href="/guide" className="text-p2 underline">ショッピングガイド</Link>
          <Link href="/legal/commercial-transactions" className="text-p2 underline">特定商取引法に基づく表記</Link>
          <Link href="/contact" className="text-p2 underline">お問い合わせ</Link>
        </div>
      </PageShell>
  );
}
