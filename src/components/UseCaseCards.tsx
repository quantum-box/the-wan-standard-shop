import Image from 'next/image'
import Link from 'next/link'

const useCases = [
  {
    href: '/use/first-bowl',
    image: '/assets/tws-creative/tws-scene-family-dog-1.jpeg',
    eyebrow: 'First Bowl',
    title: 'はじめての一椀',
    description: '素材、サイズ、扱いやすさ。迷いがちな最初の器選びを、シンプルな基準から。',
  },
  {
    href: '/use/everyday',
    image: '/assets/tws-creative/tws-scene-family-dog-2.jpeg',
    eyebrow: 'Everyday',
    title: '毎日の一椀',
    description: '毎日口にするものだから、暮らしになじむ美しさと、安心して選べる品質を。',
  },
  {
    href: '/use/gift',
    image: '/assets/tws-creative/tws-mood-texture-collection.jpeg',
    eyebrow: 'Gift',
    title: '贈る一椀',
    description: '愛犬を大切にする人へ。犬との暮らしそのものを思って選ぶ、少し特別な贈りもの。',
  },
]

export default function UseCaseCards() {
  return (
    <section className="bg-p1 py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 md:mb-20">
          <div>
            <p className="font-serif-en font-light tracking-[0.4em] text-s2 text-xs uppercase mb-5">
              Find Your Standard
            </p>
            <h2 className="font-serif-ja font-semibold text-3xl md:text-5xl text-p2 leading-snug">
              暮らしから、選ぶ。
            </h2>
          </div>
          <p className="font-sans-ja text-sm text-n1 leading-[1.9] max-w-lg">
            犬種や商品名からではなく、いまの暮らしや贈りたい気持ちから。THE WAN STANDARDの選び方を、三つの入口にまとめました。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-s2/20 border border-s2/20">
          {useCases.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-p1 flex flex-col min-h-full"
            >
              <div className="relative overflow-hidden aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-p3/10 transition-colors duration-300 group-hover:bg-transparent" />
              </div>
              <div className="p-8 md:p-9 flex flex-col flex-1">
                <p className="font-serif-en text-s2 text-xs tracking-[0.35em] uppercase mb-4">
                  {item.eyebrow}
                </p>
                <h3 className="font-serif-ja text-2xl text-p2 mb-5">{item.title}</h3>
                <p className="font-sans-ja text-sm text-n1 leading-[1.9] mb-8">
                  {item.description}
                </p>
                <span className="mt-auto font-sans-ja text-xs tracking-[0.2em] text-p2 border-b border-s2/50 pb-2 w-fit group-hover:border-p2 transition-colors">
                  この選び方を見る
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
