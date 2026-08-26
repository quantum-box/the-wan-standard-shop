import Link from "next/link";

const LINE_URL = "https://line.me/R/ti/p/@thewanstandard";

export default function ThanksPage() {
  return (
    <div className="text-center py-16 max-w-md mx-auto px-4">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">Thank You</h1>
      <p className="text-sm text-n1 mb-8">ご注文ありがとうございます。</p>
      <section className="text-left border border-s2/40 bg-white p-5 mb-8">
        <p className="text-sm text-p2 font-medium mb-2">店舗でのお受け取り</p>
        <p className="text-xs text-n1 leading-relaxed mb-3">バーナード・スクエアでお受け取りください。営業日・アクセス・受け取り時に必要な情報は案内ページで確認できます。</p>
        <Link href="/pickup" className="block text-center px-4 py-2.5 border border-p2 text-p2 text-sm hover:bg-p2 hover:text-p1 transition-colors">受け取り案内を見る</Link>
      </section>
      <section className="text-left border border-s2/40 bg-white p-5 mb-8">
        <p className="text-sm text-p2 font-medium mb-2">注文内容の確認・お問い合わせ</p>
        <p className="text-xs text-n1 leading-relaxed mb-3">注文状況は注文番号とお電話番号でご確認いただけます。変更・受け取りに関するご相談は LINE またはメールでお問い合わせください。</p>
        <div className="flex flex-col gap-2">
          <Link href="/shop/orders/lookup" className="block text-center px-4 py-2.5 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors">注文を確認する</Link>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="block text-center px-4 py-2.5 border border-p2 text-p2 text-sm hover:bg-p2 hover:text-p1 transition-colors">LINE でお問い合わせ</a>
        </div>
      </section>
      <Link href="/shop" className="text-sm text-p2 hover:text-s1 underline transition-colors">ショップに戻る</Link>
    </div>
  );
}
