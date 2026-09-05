import { PageShell } from "@/components/ui/PageShell";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お問い合わせ | THE WAN STANDARD",
  description: "THE WAN STANDARDへのご注文・商品に関するお問い合わせ窓口。",
};

const LINE_URL = "https://line.me/R/ti/p/@thewanstandard";
const EMAIL = "info@quantum-box.com";

export default function ContactPage() {
  return (
    <PageShell>
        <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-3">お問い合わせ</h1>
        <p className="text-sm text-n1 leading-relaxed mb-10">内容に応じて、下記の窓口からお問い合わせください。</p>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <section className="border border-s2/40 bg-white p-6">
            <p className="text-xs tracking-widest text-s1 mb-2">ORDER</p>
            <h2 className="font-serif-ja text-lg text-p2 mb-3">ご注文について</h2>
            <p className="text-sm text-n1 leading-relaxed mb-4">注文内容、受け取り、キャンセルなどのお問い合わせです。確認をスムーズにするため、注文番号をご用意ください。</p>
            <Link href="/shop/orders/lookup" className="text-sm text-p2 underline">先に注文状況を確認する</Link>
          </section>
          <section className="border border-s2/40 bg-white p-6">
            <p className="text-xs tracking-widest text-s1 mb-2">GENERAL</p>
            <h2 className="font-serif-ja text-lg text-p2 mb-3">商品・その他について</h2>
            <p className="text-sm text-n1 leading-relaxed">商品、サイズ、在庫、ブランドに関するお問い合わせです。商品名が分かる場合はあわせてお知らせください。</p>
          </section>
        </div>

        <section className="border-t border-s2/40 pt-8 mb-10">
          <h2 className="font-serif-ja text-lg text-p2 mb-5">お問い合わせ方法</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="text-center px-6 py-3 bg-p2 text-p1 text-sm tracking-widest hover:bg-p3 transition-colors">LINEで問い合わせる</a>
            <a href={`mailto:${EMAIL}`} className="text-center px-6 py-3 border border-p2 text-p2 text-sm hover:bg-p2 hover:text-p1 transition-colors">メールで問い合わせる</a>
          </div>
          <p className="text-xs text-n1 mt-4">メール: {EMAIL}</p>
        </section>

        <section className="bg-white border border-s2/40 p-5 text-sm text-n1 leading-relaxed">
          <h2 className="font-medium text-p2 mb-2">お問い合わせ前に</h2>
          <p>店舗の営業状況によって確認・返信にお時間をいただく場合があります。受け取り場所や営業時間は店舗受け取り案内、一般的なご質問はFAQもご確認ください。</p>
          <div className="mt-3 flex gap-5"><Link href="/pickup" className="text-p2 underline">店舗受け取り案内</Link><Link href="/faq" className="text-p2 underline">FAQ</Link></div>
        </section>
      </PageShell>
  );
}
