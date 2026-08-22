import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: "About | THE WAN STANDARD",
  description:
    "THE WAN STANDARDの哲学・ブランドストーリー。日本の工芸・陶器の美意識を、愛犬と暮らす日常に。",
  openGraph: {
    title: "About | THE WAN STANDARD",
    description:
      "THE WAN STANDARDの哲学・ブランドストーリー。日本の工芸・陶器の美意識を、愛犬と暮らす日常に。",
    url: "/about",
    images: [
      {
        url: "/assets/og/tws-og-about.jpg",
        width: 1408,
        height: 768,
        alt: "About THE WAN STANDARD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | THE WAN STANDARD",
    description:
      "THE WAN STANDARDの哲学・ブランドストーリー。日本の工芸・陶器の美意識を、愛犬と暮らす日常に。",
    images: ["/assets/og/tws-og-about.jpg"],
  },
}

export default function AboutPage() {
  return (
    <>
      <Nav />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ABOUT HERO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
        <Image
          src="/assets/tws-vi/tws-vi-hero-mood.jpeg"
          alt="About hero mood"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-p3/70" />

        <div className="relative z-10 flex flex-col items-center text-center px-8">
          <p className="font-serif-en font-light tracking-[0.5em] text-s2 text-xs uppercase mb-8">
            About Our Brand
          </p>
          <div className="h-px w-16 bg-s2/60 mb-8 mx-auto" />
          <h1 className="font-serif-ja font-semibold text-4xl md:text-6xl text-p1 leading-tight">
            THE WAN STANDARDとは
          </h1>
          <div className="h-px w-16 bg-s2/60 mt-8 mx-auto" />
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BRAND STORY — 2-COLUMN
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-p1">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: Text */}
          <div className="px-12 md:px-16 py-24 md:py-32 flex flex-col justify-center">
            <p className="font-serif-en font-light tracking-[0.4em] text-s2 text-xs uppercase mb-10">
              Brand Story
            </p>
            <div className="h-px w-16 bg-s2/40 mb-10" />

            <h2 className="font-serif-ja font-semibold text-2xl md:text-3xl text-p2 leading-snug mb-10">
              愛犬が、ちゃんと食べられる品質を、
              <br />
              日本の基準にする。
            </h2>

            <p className="font-sans-ja text-sm text-p2 leading-[1.9] font-light">
              市場に出回る犬用食器の多くは、食品安全基準が曖昧なまま。THE WAN STANDARDは、日本の食品衛生法に準拠した素材・加工のみを選定基準として採用。愛犬が口にする器だから、人と同じ安全基準で選ぶべきだという信念から生まれました。
            </p>

            <div className="h-px w-16 bg-s2/40 mt-12" />
          </div>

          {/* Right: Image */}
          <div className="relative min-h-[400px] md:min-h-0">
            <Image
              src="/assets/tws-creative/tws-scene-store-pickup-2.jpeg"
              alt="store pickup scene"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          WAN の意味セクション
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-p2 py-32">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          {/* Section header */}
          <div className="text-center mb-20">
            <p className="font-serif-en tracking-[0.5em] text-s2 text-xl md:text-2xl mb-4">
              WAN — 三つの意味
            </p>
            <div className="h-px w-24 bg-s2/50 mx-auto" />
          </div>

          {/* 4-tile grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-s2/10">
            {[
              {
                kanji: '椀',
                sub: '碗',
                title: '器そのもの',
                desc: '食の安全、美しい形。愛犬が口にする器は、人と同じ品質であるべき。',
              },
              {
                kanji: '腕',
                sub: '',
                title: '職人の腕',
                desc: '確かな技術と誇り。THE WAN STANDARD shopに並ぶのは、私たちが自信を持って選んだ器だけです。',
              },
              {
                kanji: '万',
                sub: '',
                title: '万の犬へ',
                desc: '規模と使命。すべての犬種・サイズに対応したラインナップで、一頭でも多くの愛犬へ。',
              },
              {
                kanji: '和',
                sub: '環',
                title: '日本の美意識',
                desc: '循環する関係。日本の工芸文化が育んだ美意識を、愛犬との暮らしに取り込む。',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-p2 px-8 py-12 flex flex-col border border-s2/10"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif-ja text-6xl text-p1 leading-none">{item.kanji}</span>
                  {item.sub && (
                    <span className="font-serif-ja text-2xl text-n1 leading-none">{item.sub}</span>
                  )}
                </div>
                <div className="w-6 h-px bg-s2/50 my-4" />
                <h3 className="font-serif-en text-s2 text-sm tracking-widest mb-4">{item.title}</h3>
                <p className="font-sans-ja text-xs text-n1 leading-[1.9] font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          キュレーション哲学
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative py-40 overflow-hidden">
        <Image
          src="/assets/tws-creative/tws-mood-ceramic-texture.jpeg"
          alt="ceramic texture"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-p1/85" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16">
          {/* Header */}
          <p className="font-serif-en font-light tracking-[0.4em] text-s2 text-xs uppercase mb-6">
            Curation Philosophy
          </p>
          <h2 className="font-serif-ja font-semibold text-3xl md:text-4xl text-p2 mb-20 leading-snug">
            目利きで、選ぶ。
          </h2>

          {/* 3 steps */}
          <div className="grid md:grid-cols-3 gap-16 md:gap-0">
            {[
              {
                step: '01',
                label: '出会う',
                desc: '全国の工房や職人と直接会い、器を手に取ります。申請を待つのではなく、こちらから探します。',
              },
              {
                step: '02',
                label: '試す',
                desc: '素材と製法の安全性を、自分たちの目で確かめます。食品衛生法の基準を満たすかどうか、実際に確認します。',
              },
              {
                step: '03',
                label: '選ぶ',
                desc: 'これを使ってほしいと心から思えたものだけを、THE WAN STANDARD shopに並べます。難しい言葉より、正直な一言を。',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex flex-col ${i > 0 ? 'md:border-l md:border-p2/20 md:pl-12' : ''}`}
              >
                <div className="h-px bg-p2/20 mb-8" />
                <span className="font-serif-en text-s2 text-4xl font-light mb-2">{item.step}</span>
                <h3 className="font-serif-ja text-p2 text-xl mb-6">{item.label}</h3>
                <p className="font-sans-ja text-sm text-p2 leading-[1.9] font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          作り手 TEASER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-p1 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p className="font-serif-en font-light tracking-[0.4em] text-s2 text-xs uppercase mb-8">
                Craftspeople
              </p>
              <div className="h-px w-16 bg-s2/40 mb-10" />
              <h2 className="font-serif-ja font-semibold text-2xl md:text-3xl text-p2 mb-8 leading-snug">
                腕利きの作り手たちと
              </h2>
              <p className="font-sans-ja text-sm text-p2 leading-[1.9] font-light mb-10">
                日本各地に眠る、確かな技と誇りを持つ工房。THE WAN STANDARDは、そうした作り手と愛犬家をつなぐプラットフォームです。
              </p>
              <div className="inline-block border border-s2/40 px-8 py-3">
                <span className="font-serif-en text-s2 text-xs tracking-[0.4em] uppercase">
                  Coming Soon
                </span>
              </div>
            </div>

            {/* Decorative image */}
            <div className="relative">
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <Image
                  src="/assets/tws-creative/tws-mood-seal-stamp.jpeg"
                  alt="seal stamp"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative offset border */}
              <div
                className="absolute border border-s2/30"
                style={{ inset: '-12px 12px 12px -12px', zIndex: -1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOOTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="bg-p3">
        <div className="h-px bg-gradient-to-r from-transparent via-s2/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif-en font-light tracking-[0.3em] text-s2 text-sm uppercase">
            THE WAN STANDARD
          </span>
          <p className="font-sans-ja text-n1 text-xs tracking-wide">
            © {new Date().getFullYear()} THE WAN STANDARD. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
