import type { Metadata } from "next";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "プライバシーポリシー | THE WAN STANDARD",
  description:
    "THE WAN STANDARD（運営: Quantum Box株式会社）のプライバシーポリシー（個人情報保護方針）。",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-2">
          プライバシーポリシー
        </h1>
        <p className="text-xs text-n1 mb-8">最終更新: 2026年4月22日</p>

        <div className="prose prose-sm max-w-none text-n1 leading-[1.9]">
          <p>
            Quantum Box 株式会社（以下「当社」）は、THE WAN STANDARD
            （以下「本サービス」）を運営するにあたり、お客様の個人情報を以下のとおり取り扱います。
          </p>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            1. 取得する個人情報
          </h2>
          <p>当社は、本サービスの提供にあたり以下の情報を取得します。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>氏名、住所、電話番号、メールアドレス（ご注文・お問い合わせ時）</li>
            <li>決済に必要なクレジットカード情報等（決済代行事業者が取得・保管）</li>
            <li>サービス利用履歴・購入履歴</li>
            <li>
              Cookie・アクセスログ（IPアドレス、ブラウザ種別、閲覧ページ等）
            </li>
          </ul>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            2. 利用目的
          </h2>
          <p>取得した個人情報は以下の目的で利用します。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>商品の発送・代金請求・アフターサービス</li>
            <li>お問い合わせへの対応</li>
            <li>新商品・キャンペーン等のご案内（ご希望の方のみ）</li>
            <li>サービスの品質向上・不正利用防止</li>
            <li>統計データの作成（個人を特定できない形式）</li>
          </ul>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            3. 第三者提供
          </h2>
          <p>
            当社は、以下の場合を除き、あらかじめご本人の同意を得ることなく個人情報を第三者に提供しません。
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合</li>
            <li>
              配送業務・決済処理等、サービス提供に必要な委託先へ、業務遂行に必要な範囲で提供する場合
            </li>
          </ul>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            4. Cookie・解析ツールの利用
          </h2>
          <p>
            本サービスでは、利用状況の把握および品質向上のため Google Analytics
            （Google LLC 提供）等のアクセス解析ツールを利用する場合があります。
            これらのツールは Cookie
            を用いて情報を収集しますが、個人を特定する情報は含まれません。
            Cookieの無効化はブラウザの設定により可能です。
          </p>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            5. 安全管理措置
          </h2>
          <p>
            当社は、個人情報の漏えい・滅失または毀損を防止するため、適切な安全管理措置を講じます。
            委託先に対しても必要かつ適切な監督を行います。
          </p>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            6. 開示・訂正・利用停止等
          </h2>
          <p>
            ご本人からの個人情報の開示・訂正・追加・削除・利用停止等のご請求については、
            下記お問い合わせ窓口にて対応いたします。法令に基づき速やかに対応いたします。
          </p>

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            7. お問い合わせ窓口
          </h2>
          <p>
            個人情報の取扱いに関するお問い合わせは下記までご連絡ください。
          </p>
          <div className="not-prose mt-2 p-4 bg-p1 border border-s2/30 text-sm">
            <p className="mb-1">Quantum Box 株式会社 個人情報お問い合わせ窓口</p>
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

          <h2 className="font-serif-ja text-lg text-p2 mt-8 mb-3">
            8. 改定
          </h2>
          <p>
            本ポリシーの内容は、法令の変更その他の必要に応じて改定することがあります。
            改定後の内容は本ページに掲載した時点から効力を有するものとします。
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
