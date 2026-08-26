import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'サイズ・商品の選び方 | THE WAN STANDARD',
  description: '愛犬の体格、食事量、マズル、食べる姿勢から考える、器の直径・高さ・容量の選び方。',
}

const sizeRows = [
  ['小さめ', '12–14cm前後', '4–6cm前後', '300–500ml前後', '小型犬・少量の食事の検討目安'],
  ['中くらい', '15–17cm前後', '6–8cm前後', '600–900ml前後', '柴犬など中型犬の検討目安'],
  ['大きめ', '18–21cm前後', '8–11cm前後', '1,000–1,500ml前後', '大型犬の検討目安'],
] as const

const checkpoints = [
  {
    num: '01',
    title: 'いまの器を測る',
    desc: 'まずは現在使っている器の直径・高さ・容量を測ります。「もう少し広い」「もう少し深い」のように比較すると選びやすくなります。',
  },
  {
    num: '02',
    title: '一食分を入れて考える',
    desc: '犬種だけで決めず、実際の一食分が無理なく入る容量かを確認します。フードだけでなく、トッピングや水分を加える場合も想定します。',
  },
  {
    num: '03',
    title: '顔の入り方を見る',
    desc: 'マズルの長さや顔幅によって使いやすい形は変わります。縁に顔が当たりすぎないか、底まで届きやすいかを見ます。',
  },
  {
    num: '04',
    title: '置く高さも含める',
    desc: '食器台を使う場合は、器単体ではなく床から器の縁までの高さで考えます。いつもの食べる姿勢を観察して比較してください。',
  },
]

export default function SizeGuidePage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="relative min-h-[560px] flex items-end overflow-hidden">
          <Image
            src="/assets/tws-creative/tws-scene-family-dog-1.jpeg"
            alt="愛犬に合う器を選ぶ"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-p3/90 via-p3/45 to-p3/10" />
          <div className="relative z-10 max-w-5xl w-full mx-auto px-6 md:px-10 py-16 md:py-20">
            <p className="font-serif-en text-s2 text-xs tracking-[0.4em] mb-5">HOW TO CHOOSE</p>
            <h1 className="font-serif-ja text-3xl md:text-5xl text-p1 leading-[1.5] mb-6">
              犬種ではなく、
              <br />
              その子の食べ方から選ぶ。
            </h1>
            <p className="text-sm text-p1/80 leading-[2] max-w-2xl">
              同じ犬種でも、体格や食事量、マズル、食べる姿勢はそれぞれ違います。
              サイズ表を答えにするのではなく、比較のための出発点として使ってください。
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="font-serif-en text-s2 text-xs tracking-[0.4em] mb-5">START WITH WHAT YOU KNOW</p>
            <h2 className="font-serif-ja text-2xl md:text-4xl text-p2 leading-[1.6] mb-7">いちばん確かな基準は、いま使っている器。</h2>
            <p className="text-sm text-n1 leading-[2]">
              「小型犬用」「大型犬用」だけでは、少し粗すぎることがあります。
              現在の器を実際に測り、食べている様子と照らし合わせると、次に必要なサイズが見つけやすくなります。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-s2/25 border border-s2/25 mb-20">
            {checkpoints.map((item) => (
              <article key={item.num} className="bg-p1 p-7 md:p-9 min-h-[245px]">
                <span className="font-serif-en text-s2 text-4xl font-light">{item.num}</span>
                <h3 className="font-serif-ja text-xl text-p2 mt-5 mb-4">{item.title}</h3>
                <p className="text-sm text-n1 leading-[1.9]">{item.desc}</p>
              </article>
            ))}
          </div>

          <section className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
              <div>
                <p className="font-serif-en text-s2 text-xs tracking-[0.35em] mb-3">SIZE REFERENCE</p>
                <h2 className="font-serif-ja text-2xl md:text-3xl text-p2">サイズ比較の目安</h2>
              </div>
              <p className="text-xs text-n1 max-w-sm leading-relaxed">各商品の実寸・容量を優先してください。下記は商品を比較するときの大まかな目安です。</p>
            </div>

            <div className="overflow-x-auto border-y border-s2/40">
              <table className="w-full min-w-[760px] text-sm border-collapse">
                <thead>
                  <tr className="text-left text-p2 bg-white/60">
                    <th className="py-4 px-4">目安</th>
                    <th className="py-4 px-4">直径</th>
                    <th className="py-4 px-4">高さ</th>
                    <th className="py-4 px-4">容量</th>
                    <th className="py-4 px-4">比較するときの体格例</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeRows.map((row) => (
                    <tr key={row[0]} className="border-t border-s2/30 text-n1">
                      {row.map((cell, i) => (
                        <td key={cell} className={`py-5 px-4 ${i === 0 ? 'font-medium text-p2' : ''}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-5 mb-20">
            <article className="border border-s2/40 bg-white p-7 md:p-9">
              <p className="font-serif-en text-s2 text-xs tracking-[0.3em] mb-4">EXAMPLE 01</p>
              <h2 className="font-serif-ja text-xl text-p2 mb-5">柴犬くらいの体格から考える</h2>
              <p className="text-sm text-n1 leading-[1.9] mb-5">
                中くらいのサイズ帯を出発点に、現在の器と比較してください。顔が入りやすい直径か、一食分に対して深すぎないかを見ると選びやすくなります。
              </p>
              <p className="text-xs text-n1 leading-relaxed">犬種名はあくまで比較の目安です。同じ犬種でも体格差があります。</p>
            </article>
            <article className="border border-s2/40 bg-white p-7 md:p-9">
              <p className="font-serif-en text-s2 text-xs tracking-[0.3em] mb-4">EXAMPLE 02</p>
              <h2 className="font-serif-ja text-xl text-p2 mb-5">大型犬の器を考える</h2>
              <p className="text-sm text-n1 leading-[1.9] mb-5">
                大きめの直径・容量から検討し、マズルが器の縁に当たりすぎないかを確認します。食事量が多い場合は、容量に余裕を持たせて比較してください。
              </p>
              <p className="text-xs text-n1 leading-relaxed">食器台を使う場合は、器と台を組み合わせた最終的な高さも確認してください。</p>
            </article>
          </section>

          <section className="bg-p2 text-p1 p-8 md:p-12 mb-16">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p className="font-serif-en text-s2 text-xs tracking-[0.35em] mb-4">WHEN IN DOUBT</p>
                <h2 className="font-serif-ja text-2xl mb-5">迷ったら、「何cm必要か」より「今よりどうしたいか」。</h2>
                <p className="text-sm text-p1/75 leading-[1.9] max-w-2xl">
                  今の器が小さく感じる、深すぎる、食事量に余裕がない。困っている点を一つ決めると、商品同士を比較しやすくなります。
                </p>
              </div>
              <Link href="/contact" className="inline-block border border-s2 text-s2 px-7 py-3 text-xs tracking-widest hover:bg-s2 hover:text-p3 transition-colors text-center">
                選び方を相談する
              </Link>
            </div>
          </section>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/shop" className="bg-p2 text-p1 px-8 py-3 text-xs tracking-widest hover:bg-p3 transition-colors">商品を見る</Link>
            <Link href="/use/first-bowl" className="border border-p2/40 text-p2 px-8 py-3 text-xs tracking-widest hover:border-p2 transition-colors">はじめての一椀</Link>
            <Link href="/guide/cancel" className="border border-s2/40 text-n1 px-8 py-3 text-xs hover:border-p2 hover:text-p2 transition-colors">返品・キャンセル</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
