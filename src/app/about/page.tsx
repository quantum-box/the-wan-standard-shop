import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BrandLockup } from '@/components/BrandLockup'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'About | THE WAN STANDARD',
  description:
    'THE WAN STANDARDの哲学、選定基準、作り手との向き合い方。犬と暮らす道具に、人の暮らしと同じ基準を。',
  openGraph: {
    title: 'About | THE WAN STANDARD',
    description:
      'THE WAN STANDARDの哲学、選定基準、作り手との向き合い方。犬と暮らす道具に、人の暮らしと同じ基準を。',
    url: '/about',
    images: [
      {
        url: '/assets/og/tws-og-about.jpg',
        width: 1408,
        height: 768,
        alt: 'About THE WAN STANDARD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | THE WAN STANDARD',
    description:
      'THE WAN STANDARDの哲学、選定基準、作り手との向き合い方。犬と暮らす道具に、人の暮らしと同じ基準を。',
    images: ['/assets/og/tws-og-about.jpg'],
  },
}

const standards = [
  {
    num: '01',
    en: 'SAFETY',
    title: '口に触れるものだから。',
    desc: '愛犬が毎日、直接口にする器。THE WAN STANDARDは、食品衛生法に準拠した素材・加工であることを、選定の出発点にします。',
  },
  {
    num: '02',
    en: 'FIT',
    title: 'その子の食べ方に合うこと。',
    desc: '犬種や体格だけでなく、食べ方や暮らし方も違う。サイズ、高さ、深さ、重さまで含めて、選びやすい基準をつくります。',
  },
  {
    num: '03',
    en: 'CRAFT',
    title: '作り手の顔が見えること。',
    desc: '誰が、どこで、どう作ったのか。工房や職人の技術と考え方を知り、自信を持って紹介できるものだけを選びます。',
  },
  {
    num: '04',
    en: 'LIFE',
    title: '人の暮らしにも、美しいこと。',
    desc: '犬のための道具だけれど、置かれるのは私たちの暮らしの中。長く使いたくなる佇まいまで、品質の一部だと考えます。',
  },
]

const curationSteps = [
  {
    num: '01',
    title: '探す',
    desc: '全国の工房、産地、作り手を自分たちで探します。既に有名かどうかより、確かな仕事をしているかを見ます。',
  },
  {
    num: '02',
    title: '話す',
    desc: '素材、釉薬、焼成、仕上げ。作り方だけでなく、その器をどう考えて作っているのかまで聞きます。',
  },
  {
    num: '03',
    title: '確かめる',
    desc: '愛犬が口にするものとして扱えるか。素材と製法、安全性、使い勝手をひとつずつ確認します。',
  },
  {
    num: '04',
    title: '使う',
    desc: '写真だけでは分からない重さや手触り、洗いやすさ、日々の扱いやすさまで、暮らしの目線で見ます。',
  },
  {
    num: '05',
    title: '届ける',
    desc: '難しい説明を増やすのではなく、選ぶ理由を分かりやすく。飼い主が迷わず選べる形にして届けます。',
  },
]

const meanings = [
  {
    kanji: '椀',
    sub: '碗',
    title: '器',
    desc: '毎日の食事を受け止める、暮らしの道具。',
  },
  {
    kanji: '腕',
    sub: '',
    title: '技',
    desc: '作り手が積み重ねてきた、確かな仕事。',
  },
  {
    kanji: '万',
    sub: '',
    title: 'すべての犬へ',
    desc: '一頭でも多くの犬に、選べる基準を。',
  },
  {
    kanji: '和',
    sub: '環',
    title: '暮らしと循環',
    desc: '日本の美意識を、犬と人の暮らしの中へ。',
  },
]

export default function AboutPage() {
  return (
    <>
      <Nav />

      <main>
        <section className="relative h-screen min-h-[680px] overflow-hidden flex items-end">
          <Image
            src="/assets/tws-vi/tws-vi-hero-mood.jpeg"
            alt="THE WAN STANDARDの世界観"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-p3 via-p3/55 to-p3/20" />

          <div className="relative z-10 max-w-7xl w-full mx-auto px-8 md:px-16 pb-20 md:pb-28">
            <p className="font-serif-en font-light tracking-[0.5em] text-s2 text-xs uppercase mb-8">
              About THE WAN STANDARD
            </p>
            <h1 className="font-serif-ja font-semibold text-4xl md:text-6xl lg:text-7xl text-p1 leading-[1.35] max-w-5xl">
              犬と暮らす道具に、
              <br />
              人の暮らしと同じ基準を。
            </h1>
            <p className="font-sans-ja text-sm md:text-base text-p1/80 leading-[2] mt-10 max-w-2xl font-light">
              私たちは、犬用品だからという理由で妥協しない。
              毎日口にするものだからこそ、安全で、使いやすく、美しくあるべきだと考えています。
            </p>
          </div>
        </section>

        <section className="bg-p1 py-28 md:py-40">
          <div className="max-w-5xl mx-auto px-8 md:px-16 text-center">
            <p className="font-serif-en font-light tracking-[0.45em] text-s2 text-xs uppercase mb-10">
              Why We Exist
            </p>
            <h2 className="font-serif-ja font-semibold text-3xl md:text-5xl text-p2 leading-[1.6] mb-12">
              「犬用だから、これでいい」を、
              <br className="hidden md:block" />
              終わらせたい。
            </h2>
            <p className="font-sans-ja text-sm md:text-base text-p2 leading-[2.1] font-light max-w-3xl mx-auto">
              私たちは、器を単なるペット用品とは考えていません。
              食事は毎日繰り返される、小さくて大切な時間です。
              だから、素材や製法だけでなく、手に取ったときの感触、洗うときの扱いやすさ、部屋に置いたときの佇まいまで考える。
              THE WAN STANDARDは、愛犬との日常を少しずつ良くするための「選ぶ基準」をつくるブランドです。
            </p>
          </div>
        </section>

        <section className="bg-p3 py-28 md:py-36">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
              <div>
                <p className="font-serif-en font-light tracking-[0.45em] text-s2 text-xs uppercase mb-6">
                  Our Standard
                </p>
                <h2 className="font-serif-ja font-semibold text-3xl md:text-5xl text-p1 leading-snug">
                  私たちが、見るところ。
                </h2>
              </div>
              <p className="font-sans-ja text-sm text-n1 leading-[1.9] max-w-md font-light">
                ブランド名にある「STANDARD」は、誰かに押しつける規格ではなく、
                飼い主が自分で納得して選ぶためのものです。
              </p>
            </div>

            <div className="grid md:grid-cols-2 border-t border-s2/30">
              {standards.map((item, i) => (
                <article
                  key={item.num}
                  className={`py-12 md:py-16 ${
                    i % 2 === 0 ? 'md:pr-14' : 'md:pl-14 md:border-l md:border-s2/20'
                  } ${i < 2 ? 'border-b border-s2/20' : ''}`}
                >
                  <div className="flex items-baseline justify-between gap-6 mb-8">
                    <span className="font-serif-en text-s2 text-5xl font-light">{item.num}</span>
                    <span className="font-serif-en text-n1 text-xs tracking-[0.35em]">{item.en}</span>
                  </div>
                  <h3 className="font-serif-ja text-p1 text-xl md:text-2xl mb-6">{item.title}</h3>
                  <p className="font-sans-ja text-sm text-n1 leading-[2] font-light">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-p1">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[520px] lg:min-h-[760px]">
              <Image
                src="/assets/tws-creative/tws-scene-family-dog-2.jpeg"
                alt="犬と家族が暮らす日常"
                fill
                className="object-cover"
              />
            </div>
            <div className="px-8 md:px-16 lg:px-20 py-24 lg:py-32 flex flex-col justify-center">
              <p className="font-serif-en font-light tracking-[0.45em] text-s2 text-xs uppercase mb-8">
                Made for Everyday Life
              </p>
              <h2 className="font-serif-ja font-semibold text-3xl md:text-4xl text-p2 leading-[1.6] mb-10">
                特別な日ではなく、
                <br />
                毎日のために。
              </h2>
              <div className="space-y-7 font-sans-ja text-sm text-p2 leading-[2] font-light">
                <p>
                  朝のごはん。散歩から帰ったあとの水。家族が集まる夜。
                  器は、犬との生活の中心にずっと置かれています。
                </p>
                <p>
                  私たちが目指すのは、飾っておくだけの工芸品ではありません。
                  毎日使えて、毎日洗えて、それでも使うたびに少しうれしい。
                  そんな道具を選びたいと思っています。
                </p>
              </div>
              <div className="mt-12 flex flex-wrap gap-3">
                <Link
                  href="/use/everyday"
                  className="inline-block bg-p2 text-p1 px-8 py-3 text-xs tracking-[0.25em] hover:bg-p3 transition-colors"
                >
                  毎日の一椀を見る
                </Link>
                <Link
                  href="/guide/size"
                  className="inline-block border border-p2/40 text-p2 px-8 py-3 text-xs tracking-[0.2em] hover:border-p2 transition-colors"
                >
                  選び方を見る
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-p2 py-28 md:py-36">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="text-center mb-20">
              <p className="font-serif-en font-light tracking-[0.45em] text-s2 text-xs uppercase mb-6">
                The Meaning of WAN
              </p>
              <h2 className="font-serif-ja text-3xl md:text-4xl text-p1">WANに込めた、四つの意味。</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-s2/20 border border-s2/20">
              {meanings.map((item) => (
                <article key={item.kanji} className="bg-p2 px-7 py-10 md:px-9 md:py-12 min-h-[300px]">
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="font-serif-ja text-6xl md:text-7xl text-p1 leading-none">{item.kanji}</span>
                    {item.sub && <span className="font-serif-ja text-xl text-n1">{item.sub}</span>}
                  </div>
                  <div className="w-8 h-px bg-s2/50 mb-6" />
                  <h3 className="font-serif-ja text-s2 text-base mb-4">{item.title}</h3>
                  <p className="font-sans-ja text-xs md:text-sm text-n1 leading-[1.9] font-light">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-32 md:py-44 overflow-hidden">
          <Image
            src="/assets/tws-creative/tws-mood-ceramic-texture.jpeg"
            alt="陶器の質感"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-p1/90" />

          <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16">
            <div className="max-w-3xl mb-20">
              <p className="font-serif-en font-light tracking-[0.45em] text-s2 text-xs uppercase mb-6">
                How We Curate
              </p>
              <h2 className="font-serif-ja font-semibold text-3xl md:text-5xl text-p2 leading-snug mb-8">
                売る前に、ちゃんと知る。
              </h2>
              <p className="font-sans-ja text-sm text-p2 leading-[2] font-light">
                THE WAN STANDARDは、カタログから商品を並べるだけの店にはなりたくありません。
                作り手と会い、器を知り、実際の暮らしを想像したうえで選びます。
              </p>
            </div>

            <div className="grid md:grid-cols-5 border-t border-p2/20">
              {curationSteps.map((item, i) => (
                <article
                  key={item.num}
                  className={`py-10 md:px-6 ${i === 0 ? 'md:pl-0' : 'md:border-l md:border-p2/15'}`}
                >
                  <span className="font-serif-en text-s2 text-4xl font-light">{item.num}</span>
                  <h3 className="font-serif-ja text-p2 text-xl my-5">{item.title}</h3>
                  <p className="font-sans-ja text-xs text-p2 leading-[1.9] font-light">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-p3 py-28 md:py-36 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16 lg:gap-24 items-center">
              <div>
                <p className="font-serif-en font-light tracking-[0.45em] text-s2 text-xs uppercase mb-8">
                  Craftspeople
                </p>
                <h2 className="font-serif-ja font-semibold text-3xl md:text-5xl text-p1 leading-[1.5] mb-10">
                  器の向こうに、
                  <br />
                  作り手がいる。
                </h2>
                <div className="space-y-7 font-sans-ja text-sm text-n1 leading-[2] font-light">
                  <p>
                    土を選ぶ人、釉薬を調合する人、窯の火を読む人。
                    一つの器には、長い時間をかけて積み重ねられた技術があります。
                  </p>
                  <p>
                    私たちは、その背景を消して「商品」だけを売るのではなく、
                    誰がどう作ったかまで含めて届けたい。犬用品と日本のものづくりが、自然につながる場所をつくっていきます。
                  </p>
                </div>
                <div className="mt-10 inline-flex items-center gap-4 text-s2 text-xs tracking-[0.25em]">
                  <span className="w-10 h-px bg-s2/50" />
                  CRAFT STORIES — COMING SOON
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src="/assets/tws-creative/tws-mood-seal-stamp.jpeg"
                    alt="作り手の仕事を象徴する印"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute border border-s2/35 -left-4 -top-4 right-4 bottom-4 -z-0 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-p1 py-28 md:py-36">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="font-serif-en font-light tracking-[0.45em] text-s2 text-xs uppercase mb-6">
                Find Your Standard
              </p>
              <h2 className="font-serif-ja font-semibold text-3xl md:text-4xl text-p2 mb-8">
                暮らしから、選ぶ。
              </h2>
              <p className="font-sans-ja text-sm text-p2 leading-[2] font-light">
                最初の一椀を探している人も、毎日使う器を見直したい人も、贈りものを探している人も。
                目的から選べる入口を用意しました。
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  href: '/use/first-bowl',
                  image: '/assets/tws-creative/tws-scene-family-dog-1.jpeg',
                  en: 'FIRST BOWL',
                  title: 'はじめての一椀',
                },
                {
                  href: '/use/everyday',
                  image: '/assets/tws-creative/tws-scene-morning-walk-2.jpeg',
                  en: 'EVERYDAY',
                  title: '毎日の一椀',
                },
                {
                  href: '/use/gift',
                  image: '/assets/tws-creative/tws-scene-cafe-terrace-2.jpeg',
                  en: 'GIFT',
                  title: '贈る一椀',
                },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="group relative overflow-hidden aspect-[4/5]">
                  <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-p3/85 via-p3/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <p className="font-serif-en text-s2 text-xs tracking-[0.35em] mb-3">{item.en}</p>
                    <h3 className="font-serif-ja text-p1 text-2xl">{item.title}</h3>
                    <p className="font-sans-ja text-p1/70 text-xs mt-4">詳しく見る →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative min-h-[620px] flex items-center overflow-hidden">
          <Image
            src="/assets/tws-creative/tws-scene-store-pickup-2.jpeg"
            alt="店舗で商品を受け取るシーン"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-p3/70" />
          <div className="relative z-10 max-w-7xl w-full mx-auto px-8 md:px-16 py-28">
            <div className="max-w-2xl">
              <p className="font-serif-en font-light tracking-[0.45em] text-s2 text-xs uppercase mb-8">
                From Online to Real Life
              </p>
              <h2 className="font-serif-ja font-semibold text-3xl md:text-5xl text-p1 leading-[1.5] mb-9">
                選ぶところから、
                <br />
                暮らしにつながるまで。
              </h2>
              <p className="font-sans-ja text-sm text-p1/80 leading-[2] font-light mb-10">
                THE WAN STANDARDはオンラインだけで完結するブランドではありません。
                店舗受け取りを通じて、犬と人が集まる場所とつながりながら、日々の暮らしの中に商品を届けます。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/pickup"
                  className="inline-block bg-s2 text-p3 px-9 py-3 text-xs tracking-[0.25em] hover:bg-p1 transition-colors"
                >
                  店舗受け取りについて
                </Link>
                <Link
                  href="/shop"
                  className="inline-block border border-p1/50 text-p1 px-9 py-3 text-xs tracking-[0.25em] hover:bg-p1 hover:text-p3 transition-colors"
                >
                  商品を見る
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-p2 py-28 md:py-36 text-center">
          <div className="max-w-4xl mx-auto px-8">
            <div className="w-px h-20 bg-s2/50 mx-auto mb-12" />
            <p className="font-serif-ja text-2xl md:text-4xl text-p1 leading-[1.9]">
              愛犬にとって、毎日の一椀は、
              <br />
              一生で何千回も使う道具になる。
              <br />
              だから、ちゃんと選びたい。
            </p>
            <div className="w-px h-20 bg-s2/50 mx-auto mt-12" />
            <p className="font-serif-en text-s2 text-xs tracking-[0.45em] mt-8">THE WAN STANDARD</p>
          </div>
        </section>

        <section className="bg-p1 py-24 md:py-28">
          <div className="max-w-5xl mx-auto px-8 md:px-16 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div>
              <p className="font-serif-en text-s2 text-xs tracking-[0.4em] mb-5">START HERE</p>
              <h2 className="font-serif-ja text-2xl md:text-3xl text-p2">あなたの愛犬の一椀を探す。</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="bg-p2 text-p1 px-10 py-4 text-xs tracking-[0.25em] hover:bg-p3 transition-colors">
                商品を見る
              </Link>
              <Link href="/guide/size" className="border border-p2/40 text-p2 px-10 py-4 text-xs tracking-[0.2em] hover:border-p2 transition-colors">
                選び方を見る
              </Link>
            </div>
          </div>
        </section>
      </main>

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
