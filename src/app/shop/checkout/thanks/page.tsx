import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="text-center py-16 max-w-md mx-auto px-4">
      <h1 className="font-serif-en text-2xl tracking-widest uppercase text-p2 mb-4">Thank You</h1>
      <p className="text-sm text-n1 mb-8">ご注文ありがとうございます。</p>
      <section className="text-left border border-s2/40 bg-white p-5 mb-8">
        <p className="text-sm text-p2 font-medium mb-2">注文内容の確認・お問い合わせ</p>
        <p className="text-xs text-n1 leading-relaxed mb-3">注文状況は注文番号とお電話番号でご確認いただけます。お問い合わせの際は注文番号をご用意ください。</p>
        <div className="flex flex-col gap-2">
          <Link href="/shop/orders/lookup" className="block text-center px-4 py-2.5 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors">注文を確認する</Link>
          <Link href="/contact" className="block text-center px-4 py-2.5 border border-p2 text-p2 text-sm hover:bg-p2 hover:text-p1 transition-colors">お問い合わせ</Link>
        </div>
      </section>
      <Link href="/shop" className="text-sm text-p2 hover:text-s1 underline transition-colors">ショップに戻る</Link>
    </div>
  );
}
