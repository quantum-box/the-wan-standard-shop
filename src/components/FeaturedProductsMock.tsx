import Image from 'next/image'
import Link from 'next/link'

const products = [
  {
    name: 'KOHIKI DAILY BOWL',
    ja: '粉引のデイリーボウル',
    price: '¥6,600',
    size: 'M / 600–900ml目安',
    tag: '毎日使い',
    href: '/use/everyday',
    image: '/assets/tws-hero/tws-hero-grok-1-overhead-ceramic-bowl.jpeg',
  },
  {
    name: 'KINARI FIRST BOWL',
    ja: '生成りのファーストボウル',
    price: '¥5,500',
    size: 'S–M / 300–700ml目安',
    tag: 'はじめて向け',
    href: '/use/first-bowl',
    image: '/assets/tws-vi/tws-vi-photo-good-natural-light.jpeg',
  },
  {
    name: 'KOGECHA DEEP BOWL',
    ja: '焦茶の深型ボウル',
    price: '¥7,700',
    size: 'L / 1,000ml〜目安',
    tag: '大きめ',
    href: '/guide/size',
    image: '/assets/tws-creative/tws-mood-ceramic-texture.jpeg',
  },
  {
    name: 'WAN TABLE STAND',
    ja: '食卓になじむボウルスタンド',
    price: '¥8,800',
    size: 'M–L bowl対応',
    tag: '高さを足す',
    href: '/guide/size',
    image: '/assets/tws-creative/tws-scene-family-dog-1.jpeg',
  },
  {
    name: 'WAN SELECTION SET',
    ja: '一椀と暮らしのセット',
    price: '¥12,100',
    size: 'Gift selection',
    tag: '贈りもの',
    href: '/use/gift',
    image: '/assets/tws-creative/tws-mood-seal-stamp.jpeg',
  },
  {
    name: 'TERRACE WATER BOWL',
    ja: '水飲みのための広口ボウル',
    price: '¥6,050',
    size: 'M–L / 広口',
    tag: '水飲み',
    href: '/shop',
    image: '/assets/tws-creative/tws-scene-cafe-terrace-1.jpeg',
  },
] as const

export default function FeaturedProductsMock() {
  return (
    <section className="bg-p1 py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 md:mb-18">
          <div>
            <p className="font-serif-en font-light tracking-[0.4em] text-s2 text-xs uppercase mb-5">
              Featured Selection
            </p>
            <h2 className="font-serif-ja font-semibold text-3xl md:text-5xl text-p2 leading-snug mb-5">
              こんな一椀を、
              <br />
              選べる場所へ。
            </h2>
            <p className="font-sans-ja text-sm text-n1 leading-[2] max-w-2xl">
              現在の商品構成をイメージするためのコンセプト表示です。器の大きさ、使う場面、贈る相手まで含めて、迷わず選べる売り場を目指しています。
            </p>
          </div>
          <div className="flex gap-5 text-xs tracking-wider shrink-0">
            <Link href="/shop" className="text-p2 border-b border-p2 pb-1 hover:text-s1 hover:border-s1 transition-colors">
              商品一覧を見る
            </Link>
            <Link href="/guide/size" className="text-n1 border-b border-n1/50 pb-1 hover:text-p2 hover:border-p2 transition-colors">
              選び方を見る
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 md:gap-y-16">
          {products.map((product, index) => (
            <Link key={product.name} href={product.href} className="group block">
              <article>
                <div className="relative aspect-[4/5] overflow-hidden bg-p2/5 mb-5">
                  <Image
                    src={product.image}
                    alt={product.ja}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-p3/30 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-p1/90 backdrop-blur-sm px-3 py-2">
                    <span className="font-sans-ja text-[10px] tracking-[0.16em] text-p2">
                      {product.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 border border-p1/60 px-3 py-2">
                    <span className="font-serif-en text-[10px] tracking-[0.2em] uppercase text-p1">
                      Concept {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-5 border-t border-s2/30 pt-5">
                  <div>
                    <p className="font-serif-en text-lg md:text-xl tracking-[0.08em] text-p2 mb-1">
                      {product.name}
                    </p>
                    <h3 className="font-serif-ja text-sm text-p2 mb-3">{product.ja}</h3>
                    <p className="font-sans-ja text-xs text-n1 leading-relaxed">{product.size}</p>
                  </div>
                  <p className="font-serif-en text-base text-p2 whitespace-nowrap">{product.price}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 md:mt-20 border-y border-s2/30 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="font-sans-ja text-xs text-n1 leading-[1.9] max-w-2xl">
            ※ 上記の商品名・価格・構成はトップページの売り場イメージを確認するためのモックです。実際の販売商品はShopの商品情報を正とします。
          </p>
          <Link
            href="/shop"
            className="inline-block text-center bg-p2 text-p1 px-8 py-4 text-xs tracking-[0.2em] hover:bg-p3 transition-colors shrink-0"
          >
            SHOPへ
          </Link>
        </div>
      </div>
    </section>
  )
}
