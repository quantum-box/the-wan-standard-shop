import Image from 'next/image'
import Link from 'next/link'
import { BrandLockup } from '@/components/BrandLockup'
import Nav from '@/components/Nav'
import ScenesSection from '@/components/ScenesSection'

export default function Home() {
  return (
    <>
      <Nav />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <Image
          src="/assets/tws-hero/tws-hero-grok-1-overhead-ceramic-bowl.jpeg"
          alt="overhead ceramic bowl"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-p3/60" />

        <div className="absolute bottom-0 left-0 px-10 md:px-20 pb-20 md:pb-28 max-w-3xl">
          <p className="font-serif-en font-light tracking-[0.5em] text-s2 text-sm mb-6 uppercase">
            THE WAN STANDARD
          </p>
          <h1 className="font-serif-ja font-semibold text-5xl md:text-7xl leading-tight text-p1 mb-8">
            愛犬のための、
            <br />
            新しい基準。
          </h1>
          <Link
            href="/shop"
            className="inline-block bg-p2 text-p1 px-10 py-4 text-xs tracking-[0.3em] uppercase font-sans-ja hover:bg-s2 hover:text-p3 transition-colors duration-300"
          >
            商品を見る
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-s2/60 to-transparent" />
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PHILOSOPHY SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-p1 py-32 md:py-40">
        <div className="mx-auto max-w-7xl px-8 md:px-16">
          <div className="h-px bg-s2/40 mb-24" />
          <p className="font-serif-en font-light tracking-[0.4em] text-s2 text-xs uppercase mb-16 text-center">
            Our Philosophy
          </p>
          <div className="grid md:grid-cols-3 gap-16 md:gap-8">
            <div className="flex flex-col">
              <span className="font-serif-ja text-7xl text-p2 mb-4 leading-none">椀</span>
              <div className="w-8 h-px bg-s2 mb-6" />
              <h3 className="font-serif-en text-s2 text-lg tracking-widest mb-6">選ばれた一椀</h3>
              <p className="font-sans-ja text-sm text-p2 leading-[1.9] font-light">
                食品衛生法基準の陶器・漆器のみ厳選。使うたびに、犬への愛情を感じる一品を。
              </p>
            </div>
            <div className="flex flex-col md:border-l md:border-s2/20 md:pl-8">
              <span className="font-serif-ja text-7xl text-p2 mb-4 leading-none">腕</span>
              <div className="w-8 h-px bg-s2 mb-6" />
              <h3 className="font-serif-en text-s2 text-lg tracking-widest mb-6">腕利きの作り手</h3>
              <p className="font-sans-ja text-sm text-p2 leading-[1.9] font-light">
                私たちが自信を持って選んだ工房と職人の器だけを届ける。
              </p>
            </div>
            <div className="flex flex-col md:border-l md:border-s2/20 md:pl-8">
              <span className="font-serif-ja text-7xl text-s1 mb-4 leading-none">万</span>
              <div className="w-8 h-px bg-s2 mb-6" />
              <h3 className="font-serif-en text-s2 text-lg tracking-widest mb-6">万の愛犬へ</h3>
              <p className="font-sans-ja text-sm text-p2 leading-[1.9] font-light">
                犬種・サイズを問わず使えるラインナップ。すべての愛犬に、最高の器を。
              </p>
            </div>
          </div>
          <div className="h-px bg-s2/40 mt-24" />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SCENE CAROUSEL SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <ScenesSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BRAND PROMISE SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-p1 py-32">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <p className="font-serif-en font-light tracking-[0.4em] text-s2 text-xs uppercase mb-20 text-center">
            Brand Promise
          </p>
          <div className="grid md:grid-cols-3 gap-16 md:gap-0">
            {[
              { num: '01', text: '食品衛生法基準に適合' },
              { num: '02', text: '厳選審査を通過した作り手のみ' },
              { num: '03', text: '飼い主が迷わず選べる基準' },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex flex-col pt-8 ${i > 0 ? 'md:border-l md:border-s2/20 md:pl-12' : ''}`}
              >
                <div className="h-px bg-s2/60 mb-8" />
                <span className="font-serif-en text-s2 text-5xl font-light tracking-wider mb-6">
                  {item.num}
                </span>
                <p className="font-serif-ja text-p2 text-base leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CTA BANNER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative py-40 overflow-hidden">
        <Image
          src="/assets/tws-hero/tws-hero-grok-2-shiba-goldenhour.jpeg"
          alt="shiba in golden hour"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-p3/50" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
          <div className="h-px w-24 bg-s2/60 mb-12 mx-auto" />
          <h2 className="font-serif-ja font-semibold text-3xl md:text-5xl text-p1 mb-10 leading-snug">
            あなたの愛犬に、
            <br />
            最高の一椀を。
          </h2>
          <Link
            href="/shop"
            className="inline-block bg-s2 text-p3 px-12 py-4 text-xs tracking-[0.3em] uppercase font-sans-ja hover:bg-p1 hover:text-p3 transition-colors duration-300"
          >
            今すぐ探す
          </Link>
          <div className="h-px w-24 bg-s2/60 mt-12 mx-auto" />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOOTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="bg-p3">
        <div className="h-px bg-gradient-to-r from-transparent via-s2/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <BrandLockup tone="dark" markSize={34} wordmarkClassName="text-sm" />
          <p className="font-sans-ja text-n1 text-xs tracking-wide">
            © {new Date().getFullYear()} THE WAN STANDARD. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
