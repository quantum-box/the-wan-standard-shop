import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = { title: "ギフトについて | THE WAN STANDARD", description: "THE WAN STANDARDの商品をギフトとしてご検討いただく際のご案内。" };

export default function GiftGuidePage() {
  return <><Header /><main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
    <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-3">ギフトについて</h1>
    <p className="text-sm text-n1 leading-relaxed mb-10">大切な犬と暮らす方への贈りものとしてご検討いただく際に、現在ご利用いただける範囲をご案内します。</p>

    <section className="border border-s2/40 bg-white p-6 mb-6"><h2 className="font-serif-ja text-lg text-p2 mb-3">現在のギフト対応</h2><dl className="grid grid-cols-[8rem_1fr] gap-y-3 text-sm"><dt className="text-n1">ギフト購入</dt><dd className="text-p2">商品を贈りもの用途で購入することは可能です。</dd><dt className="text-n1">ラッピング</dt><dd className="text-p2">オンライン注文での専用ラッピング指定は現在提供していません。</dd><dt className="text-n1">ギフト配送</dt><dd className="text-p2">現在は配送を行っておらず、バーナードスクエアでの店舗受け取りのみです。</dd><dt className="text-n1">お支払い</dt><dd className="text-p2">商品受け取り時の店頭払いです。</dd></dl></section>

    <section className="mb-8"><h2 className="font-serif-ja text-lg text-p2 mb-3">ご注文時の注意</h2><ul className="list-disc pl-5 text-sm text-n1 leading-relaxed space-y-2"><li>贈る相手が受け取る場合は、注文番号と注文者情報を共有してください。</li><li>器のサイズは犬種だけで決めず、現在使用している器や食事量と比較してください。</li><li>商品受け取り後のお客様都合によるサイズ交換・返品は原則として承っていません。</li></ul></section>

    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link href="/guide/size" className="text-p2 underline">サイズの選び方</Link><Link href="/guide/cancel" className="text-p2 underline">返品・キャンセル</Link><Link href="/contact" className="text-p2 underline">ギフトについて問い合わせる</Link></div>
  </main><Footer /></>;
}
