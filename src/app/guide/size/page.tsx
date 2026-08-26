import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = { title: "サイズ・商品の選び方 | THE WAN STANDARD", description: "愛犬の体格や食べ方に合わせた器のサイズ・高さ・容量の選び方。" };

const sizeRows = [
  ["小さめ", "12–14cm前後", "4–6cm前後", "300–500ml前後", "小型犬・少量の食事の目安"],
  ["中くらい", "15–17cm前後", "6–8cm前後", "600–900ml前後", "柴犬など中型犬の検討目安"],
  ["大きめ", "18–21cm前後", "8–11cm前後", "1,000–1,500ml前後", "ハスキーなど大型犬の検討目安"],
] as const;

export default function SizeGuidePage() {
  return <><Header /><main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
    <h1 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-3">サイズ・商品の選び方</h1>
    <p className="text-sm text-n1 leading-relaxed mb-10">犬種だけでなく、体格、食事量、マズルの長さ、食べる姿勢をあわせて選ぶのがおすすめです。下記は選ぶ際の比較目安で、各商品の実寸を優先してください。</p>

    <section className="mb-10 overflow-x-auto"><table className="w-full min-w-[680px] text-sm border-collapse"><thead><tr className="border-y border-s2/50 text-left text-p2"><th className="py-3 pr-4">目安</th><th className="py-3 pr-4">直径</th><th className="py-3 pr-4">高さ</th><th className="py-3 pr-4">容量</th><th className="py-3">体格例</th></tr></thead><tbody>{sizeRows.map((row) => <tr key={row[0]} className="border-b border-s2/30 text-n1">{row.map((cell) => <td key={cell} className="py-4 pr-4">{cell}</td>)}</tr>)}</tbody></table></section>

    <section className="grid md:grid-cols-2 gap-5 mb-10">
      <div className="border border-s2/40 bg-white p-6"><h2 className="font-serif-ja text-lg text-p2 mb-3">柴犬の例</h2><p className="text-sm text-n1 leading-relaxed">中型犬向けのサイズ帯から検討し、食事量と顔の入りやすさを確認してください。食器台を使う場合は、器単体の高さだけでなく床から口元までの高さも確認します。</p></div>
      <div className="border border-s2/40 bg-white p-6"><h2 className="font-serif-ja text-lg text-p2 mb-3">ハスキーの例</h2><p className="text-sm text-n1 leading-relaxed">大きめの直径・容量を基準に検討し、マズルが器の縁に当たりすぎないことを確認してください。早食いしやすい場合は一度の食事量も考慮します。</p></div>
    </section>

    <section className="border-t border-s2/40 pt-8"><h2 className="font-serif-ja text-lg text-p2 mb-3">迷ったときのチェックポイント</h2><ul className="list-disc pl-5 text-sm text-n1 space-y-2"><li>現在使っている器の直径・高さ・容量を測って比較する</li><li>首を過度に下げたり、縁に鼻が強く当たったりしないか確認する</li><li>商品ページに記載された実寸・容量を必ず確認する</li></ul><p className="text-xs text-n1 mt-5">サイズ違いによる返品条件は<Link href="/guide/cancel" className="underline text-p2">返品・キャンセルポリシー</Link>をご確認ください。</p></section>
  </main><Footer /></>;
}
