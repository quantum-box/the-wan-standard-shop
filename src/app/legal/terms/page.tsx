import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "利用規約 | THE WAN STANDARD",
  description:
    "THE WAN STANDARD（運営: Quantum Box株式会社）の利用規約。",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-2">
          利用規約
        </h1>
        <p className="text-xs text-n1 mb-8">最終更新: 2026年4月24日</p>

        <div className="prose prose-sm max-w-none text-n1 leading-[1.9]">
          <p>
            本規約は、Quantum Box 株式会社（以下「当社」）が提供する THE WAN
            STANDARD（以下「本サービス」）の利用条件を定めるものです。
            本サービスをご利用の際には、本規約の内容に同意いただいたものとみなします。
          </p>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            1. サービス概要
          </h2>
          <p>
            本サービスは、当社が運営するオンラインショップです。現在は
            バーナードスクエア（ドッグラン施設）での店頭受け取りを前提とした
            商品の予約注文機能を提供しています。
            商品のお受け取り方法および対象範囲は、当社の判断により変更することがあります。
          </p>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            2. 利用条件
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              本サービスの利用にあたり、お客様はご自身の責任においてアカウント情報・注文情報を管理するものとします。
            </li>
            <li>
              お客様は、日本の関連法令および本規約を遵守して本サービスを利用するものとします。
            </li>
            <li>
              以下の行為を禁止します。
              <ul className="list-disc pl-6 space-y-1 mt-1">
                <li>法令または公序良俗に反する行為</li>
                <li>当社または第三者の権利・利益を侵害する行為</li>
                <li>虚偽の情報を登録する行為、なりすまし行為</li>
                <li>
                  本サービスの運営を妨害する行為、不正アクセス・リバースエンジニアリング等の行為
                </li>
                <li>クーポンコード等の不正取得・不正利用</li>
              </ul>
            </li>
            <li>
              当社は、お客様が前項各号に該当すると判断した場合、事前通知なく注文キャンセル・アカウント停止等の措置を取ることができます。
            </li>
          </ul>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            3. 注文・受け取り
          </h2>
          <p>
            商品の注文は、所定の方法で確定した時点で成立します。
            店頭受け取り注文については、当社が指定する受け取り期限内にお受け取りください。
            期限を超過した場合、当社の判断により注文を自動的にキャンセルさせていただくことがあります。
          </p>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            4. 免責事項
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              当社は、本サービスの内容の正確性・完全性・有用性を保証するものではありません。
            </li>
            <li>
              通信回線・コンピュータ等の障害、天災、その他不可抗力により本サービスの提供を一時的に停止または中止することがあります。
            </li>
            <li>
              当社の故意または重過失による場合を除き、本サービスの利用または利用不能によりお客様に生じた損害について、当社は責任を負いません。
            </li>
            <li>
              お客様と第三者との間で生じた紛争については、お客様の責任と費用において解決するものとし、当社は一切の責任を負いません。
            </li>
          </ul>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            5. 規約の改定
          </h2>
          <p>
            当社は、必要と判断した場合、お客様への事前通知なく本規約を改定することができます。
            改定後の規約は、本ページに掲載した時点から効力を有するものとします。
          </p>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            6. 準拠法・管轄
          </h2>
          <p>
            本規約の解釈および適用は日本法に準拠します。
            本サービスに関してお客様と当社との間で紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            7. お問い合わせ窓口
          </h2>
          <div className="not-prose mt-2 p-4 bg-p1 border border-s2/30 text-sm">
            <p className="mb-1">Quantum Box 株式会社</p>
            <p className="mb-1">
              〒150-0043 東京都渋谷区道玄坂1丁目10番8号
            </p>
            <p>
              メール:{" "}
              <a
                href="mailto:info@quantum-box.com"
                className="underline"
              >
                info@quantum-box.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
