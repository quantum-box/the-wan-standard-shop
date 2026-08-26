import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'ギフトについて | THE WAN STANDARD',
  description: '犬と暮らす方へTHE WAN STANDARDを贈るときの選び方と、現在のギフト対応について。',
}

const giftChecks = [
  {
    num: '01',
    title: '犬の体格を知る',
    desc: '犬種名だけでなく、小型・中型・大型のどのくらいか分かると選びやすくなります。',
  },
  {
    num: '02',
    title: '今の器を聞けたら理想',
    desc: '現在使っている器の直径や容量が分かれば、サイズ選びの失敗を減らせます。',
  },
  {
    num: '03',
    title: '迷ったら無理に決めない',
    desc: 'サイズに確信がない場合は、選び方を確認してから決めるのがおすすめです。',
  },
]

export default function GiftGuidePage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="relative min-h-[580px] flex items-end overflow-hidden">
          <Image
            src="/assets/tws-creative/tws-scene-cafe-terrace-2.jpeg"
            alt="犬と暮らす人への贈りもの"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-p3/90 via-p3/45 to-p3/15" />
          <div className="relative z-10 max-w-5xl w-full mx-auto px-6 md:px-10 py-16 md:py-20">
            <p className="font-serif-en text-s2 text-xs tracking-[0.4em] mb-5">GIFT GUIDE</p>
            <h1 className="font-serif-ja text-3xl md:text-5xl text-p1 leading-[1.5] mb-7">
              犬ではなく、
              <br />
              犬との暮らしを贈る。
            </h1>
            <p className="text-sm text-p1/80 leading-[2] max-w-2xl">
              毎日使うものだからこそ、贈りものにするときは少しだけ丁寧に選ぶ。
              THE WAN STANDARDをギフトとして検討するときのポイントと、現在ご利用いただける範囲をご案内します。
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="font-serif-en text-s2 text-xs tracking-[0.4em] mb-5">BEFORE YOU CHOOSE</p>
            <h2 className="font-serif-ja text-2xl md:text-4xl text-p2 mb-7">サイズだけ、少しだけ確かめる。</h2>
            <p className="text-sm text-n1 leading-[2]">
              色や雰囲気は贈る人の感性で選べますが、器の大きさは犬ごとに違います。
              分かる範囲で体格や今使っている器を確認してから選ぶと安心です。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-s2/25 border border-s2/25 mb-20">
            {giftChecks.map((item) => (
              <article key={item.num} className="bg-p1 p-7 min-h-[245px]">
                <span className="font-serif-en text-s2 text-4xl font-light">{item.num}</span>
                <h3 className="font-serif-ja text-lg text-p2 mt-5 mb-4">{item.title}</h3>
                <p className="text-sm text-n1 leading-[1.9]">{item.desc}</p>
              </article>
            ))}
          </div>

          <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center mb-20">
            <div>
              <p className="font-serif-en text-s2 text-xs tracking-[0.35em] mb-5">CURRENT SERVICE</p>
              <h2 className="font-serif-ja text-2xl md:text-3xl text-p2 mb-7">現在のギフト対応</h2>
              <p className="text-sm text-n1 leading-[1.9] mb-7">
                現在は、通常の商品をギフト用途として購入できます。専用ラッピングやギフト配送はまだ提供していません。
              </p>
              <Link href="/use/gift" className="inline-block text-sm text-p2 underline underline-offset-4">贈る一椀の選び方を見る</Link>
            </div>

            <div className="border border-s2/40 bg-white p-7 md:p-9">
              <dl className="grid grid-cols-[8rem_1fr] gap-y-5 text-sm">
                <dt className="text-n1">ギフト購入</dt>
                <dd className="text-p2">商品を贈りもの用途で購入できます。</dd>
                <dt className="text-n1">ラッピング</dt>
                <dd className="text-p2">オンライン注文での専用ラッピング指定は現在提供していません。</dd>
                <dt className="text-n1">ギフト配送</dt>
                <dd className="text-p2">現在は配送を行っておらず、バーナード・スクエアでの店舗受け取りのみです。</dd>
                <dt className="text-n1">お支払い</dt>
                <dd className="text-p2">商品受け取り時の店頭払いです。</dd>
              </dl>
            </div>
          </section>

          <section className="bg-p2 text-p1 p-8 md:p-12 mb-20">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p className="font-serif-en text-s2 text-xs tracking-[0.35em] mb-4">CHOOSE WITH CONFIDENCE</p>
                <h2 className="font-serif-ja text-2xl mb-5">サイズが分からないときは、先に選び方を見る。</h2>
                <p className="text-sm text-p1/75 leading-[1.9] max-w-2xl">
                  犬種名だけで決めず、体格・食事量・マズル・今使っている器を比較するのがTHE WAN STANDARDの考え方です。
                </p>
              </div>
              <Link href="/guide/size" className="inline-block border border-s2 text-s2 px-7 py-3 text-xs tracking-widest hover:bg-s2 hover:text-p3 transition-colors text-center">
                サイズの選び方
              </Link>
            </div>
          </section>

          <section className="mb-16">
            <p className="font-serif-en text-s2 text-xs tracking-[0.35em] mb-5">ORDER NOTES</p>
            <h2 className="font-serif-ja text-2xl text-p2 mb-7">ご注文前に確認してほしいこと</h2>
            <div className="grid md:grid-cols-3 gap-5">
              <article className="border-t border-s2/50 pt-6">
                <h3 className="font-serif-ja text-lg text-p2 mb-3">受け取る人が来店する場合</h3>
                <p className="text-sm text-n1 leading-[1.9]">注文番号と注文者情報を共有してください。店頭で確認する場合があります。</p>
              </article>
              <article className="border-t border-s2/50 pt-6">
                <h3 className="font-serif-ja text-lg text-p2 mb-3">サイズ交換について</h3>
                <p className="text-sm text-n1 leading-[1.9]">商品受け取り後のお客様都合によるサイズ交換・返品は原則として承っていません。</p>
              </article>
              <article className="border-t border-s2/50 pt-6">
                <h3 className="font-serif-ja text-lg text-p2 mb-3">迷ったとき</h3>
                <p className="text-sm text-n1 leading-[1.9]">商品やサイズについて判断が難しい場合は、購入前にお問い合わせください。</p>
              </article>
            </div>
          </section>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="bg-p2 text-p1 px-8 py-3 text-xs tracking-widest hover:bg-p3 transition-colors">商品を見る</Link>
            <Link href="/use/gift" className="border border-p2/40 text-p2 px-8 py-3 text-xs tracking-widest hover:border-p2 transition-colors">贈る一椀</Link>
            <Link href="/contact" className="border border-s2/40 text-n1 px-8 py-3 text-xs hover:border-p2 hover:text-p2 transition-colors">ギフトについて相談する</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
